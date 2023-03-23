from flask import Blueprint
from flask import request, jsonify
from db import db
from pymongo import MongoClient
from datetime import datetime, timedelta
from api.auth_middleware import require_token
import bcrypt

salt = bcrypt.gensalt(5)

users = Blueprint("users", __name__)

# gets users without password displayed on browser
@users.route("/", methods=["GET"])
def get_users():
    users = db.users.find({}, {"password": 0})
    user_list = [
        {key: str(user[key]) for key in user if key != "password"} for user in users
    ]
    if user_list:
        return {"data": user_list}, 200
    else:
        return "No users found", 404

# gets a single user
@users.route("/single", methods=["GET"])
@require_token
def get_user(user):
    username = user["username"]
    user = db.users.find_one({"username": username})
    if user:
        user["username"] = str(user["username"])
        return {"data": username}, 200
    else:
        return "User not found", 404

@users.route("/editProfile", methods=["PUT"])
@require_token
def edit_profile(user):
    try:
        username = user["username"]
        request_data = request.get_json()
        if request_data is None:
            return jsonify({"error": "Invalid request body"}), 400
        hashedPassword = bcrypt.hashpw(request_data["password"].encode("utf-8"), salt)
        # Find the user by their username and update their information
        updated_user = db.users.find_one_and_update(
            {"username": username},
            {
                "$set": {
                    "password": hashedPassword.decode("utf-8"),
                    "name": request_data["name"],
                    "email": request_data["email"],
                }
            },
            return_document=True,
        )

        user_string = {key: str(updated_user[key]) for key in updated_user}
        return user_string, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# get route for correlations, single user
@users.route("/correlations/", methods=["GET"])
@require_token
def get_user_correlations(user):
    try:
        username = user["username"]
        correlations = db.correlations.find({"username": username})
        correlations_list = []
        for correlation in correlations:
            correlation["_id"] = str(correlation["_id"])
            correlations_list.append({key: correlation[key] for key in correlation})
        if correlations_list:
            return correlations_list, 200
        else:
            return "No correlations found", 404
    except Exception as e:
        return "Error", 500
