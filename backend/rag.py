from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
import faiss
import numpy as np
import unstructured_client
from unstructured_client.models import operations, shared
from config import api_key_auth, server_url

## Multimodal Embeddings 

client = unstructured_client.UnstructuredClient(
    api_key_auth=api_key_auth,
    server_url=server_url,
)

filename = "/home/mayankch283/bizragbot/backend/testdata/moose-mountain.pdf"
with open(filename, "rb") as f:
    data = f.read()

# Partition request to the Unstructured API to load the document
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
    # Send the request and receive the response
    response = client.general.partition(request=req)
    
    # Extract the text content from the pages
    pages = [element.get('text', '') for element in response.elements if isinstance(element, dict) and element.get('text')]
    if not pages:
        raise ValueError("No text extracted from the PDF")
except Exception as e:
    print(f"Error occurred: {e}")

# Check if pages were loaded correctly
if pages:
    # Embedding
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Embed each page's content (text) returned from the Unstructured API
    embeddings = embedding_model.embed_documents(pages)

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
    similar_pages = similarity_search(query, k=3)

    # Print out the top results
    for i, (page, distance) in enumerate(similar_pages):
        print(f"Result {i + 1}:")
        print(f"Page content: {page}")
        print(f"Similarity Score (L2 distance): {distance}\n")
else:
    print("No pages were processed from the PDF.")