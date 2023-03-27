from api.auth_middleware import require_token
from flask import Flask, request, Blueprint
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
    try:
        #receives data from frontend component
        req_data = request.get_json()
        #finds user in the database
        user = db.users.find_one({"username": req_data["username"]})
        #checks if user's provided password matches the hashed password in the database
        if user:
            password_checked = bcrypt.checkpw(
                req_data["password"].encode("utf-8"), user["password"].encode("utf-8")
            )
            #if passwords match returns the token
            if password_checked:
                return {
                    "token": jwt.encode(
                        {"username": req_data["username"]}, secret, algorithm="HS256"
                    )
                }, 200
            #if passwords do not match returns error
            else:
                return "Password is not correct", 401
        #if user is not found in database returns an error
        else:
            return "User not found", 401
    except Exception as e:
        return {"message": str(e), "error": "Authentication failed", "data": None}, 500


@auth.route("/register", methods=["POST"])
def register():
    """Receives user credentials, verifies credentials do not exist yet and creates a new user

    Returns
    -------
    dict
        a dict of the encrypted token representing the user
    """
    try:
        #receives data from frontend component
        req_data = request.get_json()
        #tries to find user in the database
        user = db.users.find_one({"username": req_data["username"]})
        #if user already exists in the database returns an error
        if user:
            return "Username taken", 401
        #if user does not exist yet, creates a new user in the database and hashes the password
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
            #once new user is created returns token representing the user
            if new_user:
                return {
                    "token": jwt.encode(
                        {"username": username}, secret, algorithm="HS256"
                    )
                }, 200
            #otherwise returns an error
            else:
                return "Could not create user", 401
    except Exception as e:
        return {"message": str(e), "error": "Registration failed", "data": None}, 500


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
        #receives data from middleware, stringifies user id
        user["_id"] = str(user["_id"])
        #removes password from user dict
        user.pop("password")
        #returns user
        return user, 200
    except:
        return {
            "message": str(e),
            "error": "Authentification failed",
            "data": None,
        }, 401
