from typing import List, Tuple    
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from huggingface_hub import login

class RAGPipeline:
    def __init__(self, retriever, model_name="meta-llama/Llama-2-7b-chat-hf", max_length=1024):
        login(token = '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')
        self.retriever = retriever
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")
        self.max_length = max_length
        self.generator = pipeline("text-generation", model=self.model, tokenizer=self.tokenizer, max_length=self.max_length)

    def _format_context(self, retrieved_chunks: List[Tuple[str, float]]) -> str:
        return "\n\n".join([chunk for chunk, _ in retrieved_chunks])

    def _generate_answer(self, context: str, question: str) -> str:
        prompt = f"""
        [INST] You are an AI assistant tasked with answering questions based on the provided context. 
        Please provide a detailed and informative answer to the question.
        
        Context:
        {context}

        Question: {question}

        Answer: [/INST]
        """

        response = self.generator(prompt, max_new_tokens=self.max_length, do_sample=True, temperature=0.7, top_p=0.95)
        return response[0]['generated_text'].split("[/INST]")[-1].strip()

    def answer(self, query: str, k: int = 5) -> str:
        retrieved_chunks = self.retriever.retrieve(query, k)
        context = self._format_context(retrieved_chunks)
        response = self._generate_answer(context, query)
        return response