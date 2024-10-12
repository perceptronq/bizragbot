import pickle
import os
from retriever import FAISSRetriever
from pipeline import RAGPipeline
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import unstructured_client
from unstructured_client.models import operations, shared
from config import api_key_auth, server_url

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
    

client = unstructured_client.UnstructuredClient(
    api_key_auth=api_key_auth,
    server_url=server_url,
)

pages = get_or_create_pages("/home/mayankch283/bizragbot/backend/testdata/moose-mountain.pdf", client)

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
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Create the retriever
    retriever = FAISSRetriever(chunks, embedding_model)
    
    rag_pipeline = RAGPipeline(retriever, model_name="google/flan-t5-large")

    # Example usage
    query = "What are the total unit sales of year 2?"
    answer = rag_pipeline.answer(query)

    print(f"Question: {query}")
    print(f"Answer: {answer}")
else:
    print("No pages were processed from the PDF.")