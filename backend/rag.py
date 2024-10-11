from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
import faiss
import numpy as np


# Ingestion
file_path = ("/home/mayankch283/bizragbot/backend/testdata/sample-privacy-policy-template.pdf") 
loader = PyPDFLoader(file_path)
pages = []

for page in loader.lazy_load():
    pages.append(page)

# Embedding
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
embeddings = embedding_model.embed_documents([page.page_content for page in pages])

# Vector store
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
query = "what are browser cookies?"
similar_pages = similarity_search(query, k=3)

# Print out the top results
for i, (page, distance) in enumerate(similar_pages):
    print(f"Result {i + 1}:")
    print(f"Page content: {page.page_content}")
    print(f"Similarity Score (L2 distance): {distance}\n")
