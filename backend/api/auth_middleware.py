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
        # checks for authorization headers
        if "Authorization" in request.headers:
            token = request.headers["Authorization"]

        # if there's no token in authorization header, return an error
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

            # if no matching user is found in the database, send an error
            if not user:
                return {
                    "data": None,
                    "error": "Invalid token",
                    "message": "Authentication failed",
                }, 401
            # if user is found, return the user and args
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
        # check for authorization in req body sent by delete request
        if "authorization" in data:
            token = data["authorization"]
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
            # if there's no user in the database, send an error
            if not user:
                return {
                    "data": None,
                    "error": "Invalid token",
                    "message": "Authentication failed",
                }, 401
            # if we found a match in the db, return the user and args
            return f(user, *args, **kwargs)
        except Exception as e:
            return {
                "message": str(e),
                "error": "Error fetching user",
                "data": None,
            }, 500

    return auth_delete
