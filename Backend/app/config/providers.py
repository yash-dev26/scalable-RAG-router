from openai import OpenAI
from groq import Groq
from app.config.server import config

openai_client = OpenAI(
    api_key=config["openai_api_key"]
)

groq_client = Groq(
    api_key=config["groq_api_key"]
)