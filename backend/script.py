import os
import requests

r = requests.get(
    url="https://raw.githubusercontent.com/openvinotoolkit/openvino_notebooks/latest/utils/notebook_utils.py",
)
with open("notebook_utils.py", "w") as f:
    f.write(r.text)

r = requests.get(
    url="https://raw.githubusercontent.com/openvinotoolkit/openvino_notebooks/latest/utils/pip_helper.py",
)
open("pip_helper.py", "w").write(r.text)

from pip_helper import pip_install

os.environ["GIT_CLONE_PROTECTION_ACTIVE"] = "false"

pip_install("--pre", "-U", "openvino>=2024.2.0", "--extra-index-url", "https://storage.openvinotoolkit.org/simple/wheels/nightly")
pip_install("--pre", "-U", "openvino-tokenizers[transformers]", "--extra-index-url", "https://storage.openvinotoolkit.org/simple/wheels/nightly")
pip_install(
    "--extra-index-url",
    "https://download.pytorch.org/whl/cpu",
    "git+https://github.com/huggingface/optimum-intel.git",
    "git+https://github.com/openvinotoolkit/nncf.git",
    "datasets",
    "accelerate",
    "gradio>=4.19",
    "onnx<1.16.2",
    "einops",
    "transformers_stream_generator",
    "tiktoken",
    "transformers>=4.43.1",
    "faiss-cpu",
    "sentence_transformers",
    "langchain>=0.2.0",
    "langchain-community>=0.2.15",
    "langchainhub",
    "unstructured",
    "scikit-learn",
    "python-docx",
    "pypdf",
)