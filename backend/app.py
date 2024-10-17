from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from flask_cors import CORS
import pickle
import os
from retriever import FAISSRetriever
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import unstructured_client
from unstructured_client.models import operations, shared
from config import api_key_auth, server_url
import requests

app = Flask(__name__)
CORS(app)

retriever = None
rag_pipeline = None

# LM Studio settings
LM_STUDIO_URL = "http://localhost:1234/v1" 

class LMStudioPipeline:
    def __init__(self, retriever, max_length=1024, temperature=0.7):
        self.retriever = retriever
        self.max_length = max_length
        self.temperature = temperature

    def answer(self, query):
        relevant_docs = self.retriever.get_relevant_documents(query)
        context = "\n".join(relevant_docs)
        prompt = f"Context: {context}\n\nQuestion: {query}\n\nAnswer:"

        response = requests.post(
            f"{LM_STUDIO_URL}/chat/completions",
            json={
                "model": "local-model",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": self.max_length,
                "temperature": self.temperature
            }
        )

        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"Error: {response.status_code} - {response.text}"

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

def initialize_rag(file_path, max_length=1024, temperature=0.7):
    global retriever, rag_pipeline
    
    client = unstructured_client.UnstructuredClient(
        api_key_auth=api_key_auth,
        server_url=server_url,
    )

    pages = get_or_create_pages(file_path, client)

    if pages:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = []
        for page in pages:
            chunks.extend(text_splitter.split_text(page))

        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        retriever = FAISSRetriever(chunks, embedding_model)
        rag_pipeline = LMStudioPipeline(retriever, max_length=max_length, temperature=temperature)
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
        if initialize_rag(file_path, max_length=2048, temperature=0.8):
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