from app.config.server import config
from langgraph.checkpoint.mongodb import MongoDBSaver

def connect_to_mongodb():
    if config["mongodb_uri"] is None:
        raise ValueError("MONGODB_URI is not set in the environment variables.")
    return MongoDBSaver.from_conn_string(config["mongodb_uri"])