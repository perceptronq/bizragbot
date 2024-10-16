import google.generativeai as genai
from typing import List, Tuple
import os
from config import GOOGLE_API_KEY

class RAGPipeline:
    def __init__(self, retriever, model_name="gemini-pro", max_length=1024, temperature=0.7):
        genai.configure(api_key=GOOGLE_API_KEY)
        self.retriever = retriever
        self.model = genai.GenerativeModel(model_name)
        self.max_length = max_length
        self.temperature = temperature

    def _format_context(self, retrieved_chunks: List[Tuple[str, float]]) -> str:
        return "\n\n".join([chunk for chunk, _ in retrieved_chunks])

    def _generate_answer(self, context: str, question: str) -> str:
        prompt = f"""
        You are an innovative AI assistant with a talent for creative problem-solving and insightful predictions. Your task is to provide detailed, imaginative, and well-reasoned responses based on the given context and question. When making predictions or suggesting improvements, think outside the box and consider multiple perspectives.

        Guidelines:
        1. Be specific and provide multiple detailed suggestions or predictions.
        2. Consider both short-term and long-term implications.
        3. If relevant, include potential risks and mitigation strategies.
        4. Use data from the context to support your ideas, but don't be afraid to extrapolate creatively.
        5. If appropriate, suggest innovative approaches that might not be immediately obvious.

        Context:
        {context}

        Question: {question}

        Creative and Insightful Answer:
        """

        response = self.model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=self.max_length,
                temperature=self.temperature,
                top_p=0.95,
                top_k=40
            )
        )
        return response.text

    def answer(self, query: str, k: int = 5) -> str:
        retrieved_chunks = self.retriever.retrieve(query, k)
        context = self._format_context(retrieved_chunks)
        response = self._generate_answer(context, query)
        return response