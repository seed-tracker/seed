from functools import wraps
import jwt
from flask import current_app, request, abort
from db import db
import os

secret = os.environ.get("JWT_SECRET")


def require_token(f):
    @wraps(f)
    def auth(*args, **kwargs):
        token = None
        # check for authorization
        if "Authorization" in request.headers:
            token = request.headers["Authorization"]

        # if there's no token, return an error
        if token is None:
            return {
                "data": None,
                "error": "Not authorized",
                "message": "Authentification token required",
            }, 401

        try:
            # try to decode the token and get the user from the db
            decoded_user = jwt.decode(token, secret, algorithms="HS256")
            user = db.users.find_one({"username": decoded_user["username"]})

            # if there's no user, send an error
            if not user:
                return {
                    "data": None,
                    "error": "Invalid token",
                    "message": "Authentication failed",
                }, 401
            # if there is, return the user and args
            return f(user, *args, **kwargs)

        except Exception as e:
            return {
                "message": str(e),
                "error": "Error fetching user",
                "data": None,
            }, 500

    return auth
