import redis
from app.config.server import config

print("INIT REDIS")

redis_client = redis.Redis(
    host=config["redis_host"],
    port=int(config["redis_port"]),
    password=config["redis_password"],
    ssl=True,
    ssl_cert_reqs=None,
    decode_responses=True,
)

print("PINGING REDIS")

try:
    print(redis_client.ping())
    print("REDIS OK")
except Exception as e:
    print("REDIS FAILED:", e)