from fastapi import Request, HTTPException
import jwt
import os

CLERK_PEM_PUBLIC_KEY = os.getenv("CLERK_PEM_PUBLIC_KEY")

def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing auth")

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            CLERK_PEM_PUBLIC_KEY,
            algorithms=["RS256"],
        )

        return payload

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")