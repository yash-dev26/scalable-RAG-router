from fastapi import Request, HTTPException
import jwt
import requests

from app.config.server import config

CLERK_ISSUER = config["clerk_issuer"]
JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"


def get_signing_key(token):
    jwks = requests.get(JWKS_URL).json()

    unverified_header = jwt.get_unverified_header(token)
    kid = unverified_header.get("kid")

    for key in jwks["keys"]:
        if key["kid"] == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(key)

    raise Exception("Signing key not found")


def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing auth")

    parts = auth_header.split(" ", 1)

    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = parts[1]

    try:
        signing_key = get_signing_key(token)

        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={
                "verify_aud": False
            }
        )

        return payload

    except Exception as e:
        print("[auth] token verification failed:", e)
        raise HTTPException(status_code=401, detail="Invalid token")