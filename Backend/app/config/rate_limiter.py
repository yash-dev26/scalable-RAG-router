from slowapi import Limiter
from slowapi.util import get_remote_address

# Centralized limiter instance to avoid circular imports
limiter = Limiter(key_func=get_remote_address)
