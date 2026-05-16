from dotenv import load_dotenv
import os
load_dotenv()

config = {
    "qdrant_url": os.getenv("QDRANT_URL"),
    "qdrant_api_key": os.getenv("QDRANT_API_KEY"),
    "qdrant_collection_name": os.getenv("QDRANT_COLLECTION_NAME"),
    "openai_api_key": os.getenv("OPENAI_API_KEY"),
    "mongodb_uri": os.getenv("MONGODB_URI"),
    "semantic_cache_collection_name": os.getenv("SEMANTIC_CACHE_COLLECTION_NAME"),
    "clerk_pem_public_key": os.getenv("CLERK_PEM_PUBLIC_KEY"),
    "CORS_ORIGINS": os.getenv("CORS_ORIGINS", "http://localhost:5174,http://localhost:5173,http://localhost:3000"),
    "redis_host": os.getenv("REDIS_HOST", "localhost"),
}