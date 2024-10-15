from pathlib import Path
import torch
import ipywidgets as widgets
from transformers import (
    TextIteratorStreamer,
    StoppingCriteria,
    StoppingCriteriaList,
)

from llm_config import (
    SUPPORTED_EMBEDDING_MODELS,
    SUPPORTED_RERANK_MODELS,
    SUPPORTED_LLM_MODELS,
)

model_languages = list(SUPPORTED_LLM_MODELS)

model_language = widgets.Dropdown(
    options=model_languages,
    value=model_languages[0],
    description="Model Language:",
    disabled=False,
)

# print(model_language)

llm_model_ids = [model_id for model_id, model_config in SUPPORTED_LLM_MODELS[model_language.value].items() if model_config.get("rag_prompt_template")]

llm_model_id = widgets.Dropdown(
    options=llm_model_ids,
    value=llm_model_ids[10],
    description="Model:",
    disabled=False,
)

# print(llm_model_id)

llm_model_configuration = SUPPORTED_LLM_MODELS[model_language.value][llm_model_id.value]
print(f"Selected LLM model {llm_model_id.value}")
