from api.auth_middleware import require_token
from flask import Flask, request, Blueprint, jsonify
from db import db
import bcrypt
import jwt
import os
from datetime import datetime

salt = bcrypt.gensalt(5)
secret = os.environ.get("JWT_SECRET")

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    """Receives login data and verifies credentials allowing user to log in

    Returns
    -------
    dict
        a dict of the encrypted token representing the user
    """
    print("login!!")
    try:
        req_data = request.get_json()

        user = db.users.find_one({"username": req_data["username"]})
        # checks if user's provided password matches the hashed password in the database
        if user:
            password_checked = bcrypt.checkpw(
                req_data["password"].encode("utf-8"), user["password"].encode("utf-8")
            )

            if password_checked:
                return {
                    "token": jwt.encode(
                        {"username": req_data["username"]}, secret, algorithm="HS256"
                    )
                }, 200

            else:
                return "Password is not correct", 401

        else:
            return "User not found", 401
    except Exception as e:
        print(str(e))
        return "Authentication failed", 500


@auth.route("/register", methods=["POST"])
def register():
    """Receives user credentials, verifies credentials do not exist yet and creates a new user

    Returns
    -------
    dict
        a dict of the encrypted token representing the user
    """
    try:
        req_data = request.get_json()

        user = db.users.find_one({"username": req_data["username"]})

        if user:
            return "Username taken", 401

        else:
            name = req_data["name"]
            username = req_data["username"]

            password = bcrypt.hashpw(req_data["password"].encode("utf-8"), salt)
            email = req_data["email"]

            if req_data["birthdate"]:
                birthdate = datetime.strptime(req_data["birthdate"], "%Y-%m-%d")

            else:
                birthdate = None

            new_user = db.users.insert_one(
                {
                    "name": name,
                    "username": username,
                    "password": password.decode("utf-8"),
                    "email": email,
                    "birthdate": birthdate,
                }
            )

            if new_user:
                return {
                    "token": jwt.encode(
                        {"username": username}, secret, algorithm="HS256"
                    )
                }, 200

            else:
                return "Could not create user", 401
    except Exception as e:
        return "Registration failed", 500


@auth.route("/me", methods=["GET"])
@require_token
def authenticate(user):
    """Receives user data, removes password from dict

    Parameters
    -------
    dict
        a dict of the user based on the token

    Returns
    -------
    dict
        a dict of the user without the password
    """
    try:
        user["_id"] = str(user["_id"])

        user.pop("password")

        return user, 200
    except Exception as e:
        return "Authentication failed", 401


@auth.route("/demo", methods=["POST"])
def login_demo():
    try:
        return {
            "token": jwt.encode(
                {"username": os.environ.get("DEMO_USER")}, secret, algorithm="HS256"
            )
        }, 200

    except Exception as e:
        print(str(e))
        return "Authentication failed", 500
