import pickle
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import faiss
import numpy as np
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
    

## Multimodal embedding

client = unstructured_client.UnstructuredClient(
    api_key_auth=api_key_auth,
    server_url=server_url,
)

pages = get_or_create_pages("/home/mayankch283/bizragbot/backend/testdata/moose-mountain.pdf", client)

# Check if pages were loaded correctly
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

    # Embed each page's content (text) returned from the Unstructured API
    embeddings = embedding_model.embed_documents(chunks)

    # Vector store setup
    dimension = len(embeddings[0])  # Get embedding vector size
    index = faiss.IndexFlatL2(dimension)  # Using L2 (Euclidean distance) as similarity metric

    # Convert embeddings to numpy array for FAISS
    embedding_array = np.array(embeddings).astype('float32')

    # Add embeddings to the FAISS index
    index.add(embedding_array)

    # Perform similarity search
    def similarity_search(query: str, k: int = 5):
        # Embed the query
        query_embedding = embedding_model.embed_query(query)
        query_embedding_np = np.array([query_embedding]).astype('float32')  # Convert query to numpy

        # Perform FAISS search (returns indices of the k most similar embeddings)
        distances, indices = index.search(query_embedding_np, k)

        # Fetch the corresponding documents/pages
        results = [(pages[i], distances[0][idx]) for idx, i in enumerate(indices[0])]
        return results

    # Example usage
    query = "what are total unit sales of year 2?"
    similar_chunks = similarity_search(query, k=3)

    # Print out the top results
    for i, (chunk, distance) in enumerate(similar_chunks):
        print(f"Result {i + 1}:")
        print(f"Page content: {page}")
        print(f"Similarity Score (L2 distance): {distance}\n")
else:
    print("No pages were processed from the PDF.")