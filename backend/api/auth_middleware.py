from functools import wraps
import jwt
from flask import current_app, request, abort
from db import db
import os

secret = os.environ.get("JWT_SECRET")


def require_token(f):
    @wraps(f)
    def auth(*args, **kwargs):
        """Authorizes user through provided token

        Returns
        -------
        dict
            a user dict if user is authorized to request page
        """
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"]

        if token is None:
            return {
                "data": None,
                "error": "Not authorized",
                "message": "Authentification token required",
            }, 401

        try:
            decoded_user = jwt.decode(token, secret, algorithms="HS256")
            user = db.users.find_one({"username": decoded_user["username"]})

            if not user:
                return {
                    "data": None,
                    "error": "Invalid token",
                    "message": "Authentication failed",
                }, 401

            return f(user, *args, **kwargs)
        except Exception as e:
            return {
                "message": str(e),
                "error": "Error fetching user",
                "data": None,
            }, 500

    return auth


def require_token_delete(f):
    @wraps(f)
    def auth_delete(*args, **kwargs):
        """Authorizes user through provided token - function specific to delete routes

        Returns
        -------
        dict
            a user dict if user is authorized to request page
        """
        token = None
        data = request.get_json()

        if "authorization" in data:
            token = data["authorization"]

        if token is None:
            return {
                "data": None,
                "error": "Not authorized",
                "message": "Authentification token required",
            }, 401
        try:
            decoded_user = jwt.decode(token, secret, algorithms="HS256")
            user = db.users.find_one({"username": decoded_user["username"]})

            if not user:
                return {
                    "data": None,
                    "error": "Invalid token",
                    "message": "Authentication failed",
                }, 401

            return f(user, *args, **kwargs)
        except Exception as e:
            return {
                "message": str(e),
                "error": "Error fetching user",
                "data": None,
            }, 500

    return auth_delete
