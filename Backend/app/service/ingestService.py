from app.ingestion.embeddings import gen_embeddingsAndStoreInQdrant
from app.ingestion.chunking import load_file, split_text
from app.config.server import config
from app.repository.qdrant import find_existing_file_id_by_content_hash

async def ingest_data(request):
    existing_file_id = find_existing_file_id_by_content_hash(
        collection_name=config["qdrant_collection_name"],
        user_id=request.user_id,
        content_hash=request.content_hash,
    )

    if existing_file_id:
        print(
            f"[ingest] Duplicate file detected for user_id={request.user_id}; "
            f"existing file_id={existing_file_id}. Skipping re-ingestion."
        )
        return {
            "status": "success",
            "duplicate": True,
            "file_id": existing_file_id,
            "message": "Duplicate file already ingested.",
        }

    text = load_file(request.file_path)
    print(f"Loaded text from file: {text[:100]}...")  # Debug: Print the first 100 characters of the loaded text

    chunks = split_text(text)
    

    result = await gen_embeddingsAndStoreInQdrant(
        chunks,
        request.file_id,
        request.user_id,
        request.content_hash,
    )
    return result
