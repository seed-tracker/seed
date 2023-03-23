from flask import Blueprint, request, jsonify
from db import db
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


# gets each single user's symptoms, paginated
@users.route("/symptoms", methods=["GET"])
@require_token
def get_user_symptoms(user):
    try:
        username = user["username"]

        page = int(request.args.get("page"))
        if not page:
            page = 1

        offset = (page - 1) * 20

        total_symptoms = db.user_symptoms.count_documents({"username": username})

        if offset > total_symptoms:
            offset = total_symptoms - 20

        symptoms = [
            symptom
            for symptom in db.user_symptoms.aggregate(
                [
                    {"$match": {"username": username}},
                    {"$project": {"_id": 0}},
                    {"$sort": {"datetime": -1}},
                    {"$skip": offset},
                    {"$limit": 20},
                ]
            )
        ]

        if symptoms:
            return {"count": total_symptoms, "symptoms": symptoms}, 200
        else:
            return f"No meals found for user {username}", 500

    except Exception as e:
        print("Error! ", str(e))
        return "Error fetching meals", 500


# post route for adding a meal to the user's collection
@users.route("/addMeal", methods=["POST"])
@require_token
def add_entry(user):
    try:
        username = user["username"]
        entry_name = request.json.get("entry_name")
        date = request.json.get("date")
        time = request.json.get("time")

        if not time:
            time = datetime.now().time().strftime("%H:%M")
        if not date:
            date = datetime.now().date().strftime("%Y-%m-%d")

        meal_time = datetime.strptime(date + " " + time, "%Y-%m-%d %H:%M")

        food_group = request.json.get("foodGroup")
        food_items = request.json.get("foodItems")
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
            "groups": [food_group],
            "foods": [food_items],
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
