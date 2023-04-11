from flask import Blueprint, request, jsonify
from db import db
from datetime import datetime, timedelta
from api.auth_middleware import require_token
import bcrypt
from database.algo import find_correlations


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


# gets a single user, username only
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


# post route for adding a meal to the user's collection
@users.route("/addMeal", methods=["POST"])
@require_token
def add_entry(user):
    """Adds a meal to the database

    Returns
    -------

        success or error message/status
    """

    try:
        username = user["username"]
        entry_name = request.json.get("entry_name") or "Breakfast"
        date = request.json.get("date")
        time = request.json.get("time")

        if not time:
            time = datetime.now().time().strftime("%H:%M")
        if not date:
            date = datetime.now().date().strftime("%Y-%m-%d")

        meal_time = datetime.strptime(date + " " + time, "%Y-%m-%d %H:%M")

        groups = request.json.get("groups")
        foods = request.json.get("foods")
        timelimit = meal_time + timedelta(hours=30)

        symptoms = db.user_symptoms.find(
            {"username": username, "datetime": {"$gte": meal_time, "$lte": timelimit}}
        )

        symptom_list = []
        for symptom in symptoms:
            symptom_list.append(symptom["_id"])

        entry = {
            "entry_name": entry_name,
            "username": username,
            "datetime": meal_time,
            "groups": groups,
            "foods": foods,
            "related_symptoms": symptom_list,
        }

        db.meals.insert_one(entry)

        return jsonify({"message": "Entry added successfully!"}), 201
    except Exception as e:
        print("Error! ", str(e))
        return "Error adding meal", 401


@users.route("/editProfile", methods=["PUT"])
@require_token
def edit_profile(user):
    """Edits a user's name and/or email and/or password

    Returns
    -------
    string
        user data
    """
    try:
        username = user["username"]
        request_data = request.get_json()
        if request_data is None:
            return jsonify({"error": "Invalid request"}), 400

        set_dict = {"name": request_data["name"], "email": request_data["email"]}

        if (
            "password" in request_data
            and len(request_data["password"]) > 1
            and "newPassword" in request_data
            and len(request_data["newPassword"]) >= 1
        ):
            # check if the password is correct before changing it
            password_checked = bcrypt.checkpw(
                request_data["password"].encode("utf-8"),
                user["password"].encode("utf-8"),
            )

            if not password_checked:
                return jsonify({"message": "Wrong password"}), 401

            set_dict["password"] = bcrypt.hashpw(
                request_data["newPassword"].encode("utf-8"), salt
            ).decode("utf-8")

        # Find the user by their username and update their information
        updated_user = db.users.find_one_and_update(
            {"username": username},
            {"$set": set_dict},
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
            return jsonify({"message": "No correlations found"}), 204
    except Exception as e:
        return (
            jsonify({"message": "An error occured fetching the user's correlations"}),
            500,
        )

# re-run the algorithm (when app mounts) to update correlations
@users.route("/correlations/update", methods=["PUT"])
@require_token
def update_user_correlations(user):
    try:
        username = user["username"]

        find_correlations(username)

        return "Success!", 204

    except Exception as e:
        return jsonify({"error": str(e)}), 500
