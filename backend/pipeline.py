from typing import List, Tuple
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

class RAGPipeline:
    def __init__(self, retriever, model_name="google/flan-t5-large", max_length=512):
        self.retriever = retriever
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        self.max_length = max_length

    def _format_context(self, retrieved_chunks: List[Tuple[str, float]]) -> str:
        return "\n\n".join([chunk for chunk, _ in retrieved_chunks])

    def _generate_answer(self, context: str, question: str) -> str:
        prompt = f"""
        Use the following pieces of context to answer the question at the end.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.

        Context:
        {context}

        Question: {question}

        Answer:
        """

        inputs = self.tokenizer(prompt, return_tensors="pt", max_length=self.max_length, truncation=True)
        
        with torch.no_grad():
            outputs = self.model.generate(**inputs, max_length=self.max_length, num_return_sequences=1, temperature=0.7)
        
        answer = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return answer.strip()

    def answer(self, query: str, k: int = 3) -> str:
        retrieved_chunks = self.retriever.retrieve(query, k)
        context = self._format_context(retrieved_chunks)
        response = self._generate_answer(context, query)
        return response