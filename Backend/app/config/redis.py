import redis
from app.config.server import config

redis_client = redis.Redis(
    host=config["redis_host"],
    port=6379,
    db=0,
    decode_responses=True  # important (strings instead of bytes)
)