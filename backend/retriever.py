from typing import List, Tuple
import faiss
import numpy as np
from langchain_huggingface import HuggingFaceEmbeddings

class FAISSRetriever:
    def __init__(self, chunks: List[str], embedding_model: HuggingFaceEmbeddings):
        self.chunks = chunks
        self.embedding_model = embedding_model
        self.index = None
        self._build_index()

    def _build_index(self):
        embeddings = self.embedding_model.embed_documents(self.chunks)
        embedding_array = np.array(embeddings).astype('float32')
        dimension = len(embeddings[0])
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embedding_array)

    def retrieve(self, query: str, k: int = 5) -> List[Tuple[str, float]]:
        query_embedding = self.embedding_model.embed_query(query)
        query_embedding_np = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(query_embedding_np, k)
        results = [(self.chunks[i], distances[0][idx]) for idx, i in enumerate(indices[0])]
        return results

    def get_relevant_documents(self, query: str, k: int = 5) -> List[str]:
        results = self.retrieve(query, k)
        return [doc for doc, _ in results]