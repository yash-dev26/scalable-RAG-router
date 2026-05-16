from fastapi import Request, HTTPException
import jwt
import os
from app.config.server import config
CLERK_PEM_PUBLIC_KEY = config["clerk_pem_public_key"]

def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing auth")

    parts = auth_header.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = parts[1]

    try:
        payload = jwt.decode(
            token,
            CLERK_PEM_PUBLIC_KEY,
            algorithms=["RS256"],
        )

        return payload

    except Exception as e:
        print(f"[auth] token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")