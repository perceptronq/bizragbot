from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from flask_cors import CORS
import pickle
import os
from retriever import FAISSRetriever
from pipeline import RAGPipeline
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import unstructured_client
from unstructured_client.models import operations, shared
from config import api_key_auth, server_url

app = Flask(__name__)
CORS(app)

retriever = None
rag_pipeline = None

def get_or_create_pages(filename, client, force_refresh=False):
    # unique identifier for the file
    file_id = os.path.basename(filename)
    cache_file = f"{file_id}_cache.pkl"

    # load from cache if exists
    if os.path.exists(cache_file) and not force_refresh:
        print("Loading data from local cache...")
        with open(cache_file, 'rb') as f:
            return pickle.load(f)

    print("Fetching data from Unstructured API...")
    with open(filename, "rb") as f:
        data = f.read()

    req = operations.PartitionRequest(
        partition_parameters=shared.PartitionParameters(
            files=shared.Files(
                content=data,
                file_name=filename,
            ),
            strategy=shared.Strategy.HI_RES,
            languages=['eng'],
        ),
    )

    try:
        response = client.general.partition(request=req)
        pages = [element.get('text', '') for element in response.elements if isinstance(element, dict) and element.get('text')]
        if not pages:
            raise ValueError("No text extracted from the PDF")
        
        # Cache the result
        with open(cache_file, 'wb') as f:
            pickle.dump(pages, f)
        
        return pages
    except Exception as e:
        print(f"Error occurred: {e}")
        return None

def initialize_rag(file_path):
    global retriever, rag_pipeline
    
    client = unstructured_client.UnstructuredClient(
        api_key_auth=api_key_auth,
        server_url=server_url,
    )

    pages = get_or_create_pages(file_path, client)

    if pages:
        # Implement chunking
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = []
        for page in pages:
            chunks.extend(text_splitter.split_text(page))

        # Embedding
        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

        # Create the retriever
        retriever = FAISSRetriever(chunks, embedding_model)
        
        rag_pipeline = RAGPipeline(retriever, model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0")
        return True
    else:
        print("No pages were processed from the PDF.")
        return False

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)
        if initialize_rag(file_path):
            return jsonify({"message": "File uploaded and processed successfully"}), 200
        else:
            return jsonify({"error": "Failed to process the file"}), 500

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    if not data or 'query' not in data:
        return jsonify({"error": "No query provided"}), 400
    
    if not rag_pipeline:
        return jsonify({"error": "RAG pipeline not initialized. Please upload a file first."}), 400

    query = data['query']
    answer = rag_pipeline.answer(query)
    return jsonify({"answer": answer}), 200

if __name__ == '__main__':
    app.run(debug=True)