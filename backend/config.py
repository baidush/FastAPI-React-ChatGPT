import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# OpenAI
OPENAI_API = os.getenv("OPENAI_API")