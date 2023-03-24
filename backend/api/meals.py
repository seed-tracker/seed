from flask import Blueprint
from db import db
from flask import request, jsonify
from datetime import datetime, timedelta
from api.auth_middleware import require_token, require_token_delete
from bson.objectid import ObjectId

meals = Blueprint("meals", __name__)


# gets a single user's meals, paginated
@meals.route("/user", methods=["GET"])
@require_token
def get_user_meals(user):
    try:
        username = user["username"]

        page = request.args.get("page")
        if page:
            page = int(page)
        else:
            page = 1

        offset = (page - 1) * 20

        total_meals = db.meals.count_documents({"username": username})

        if offset > total_meals:
            offset = total_meals - 20

        meals = [
            meal
            for meal in db.meals.aggregate(
                [
                    {"$match": {"username": username}},
                    {"$project": {"_id": {"$toString": "$_id"},"entry_name": 1, "datetime": 1, "groups": 1, "foods": 1}},
                    {"$sort": {"datetime": -1}},
                    {"$skip": offset},
                    {"$limit": 20},
                ]
            )
        ]

        if meals:
            return {"count": total_meals, "meals": meals}, 200
        else:
            return f"No meals found for user {username}", 500

    except Exception as e:
        print("Error! ", str(e))
        return "Error fetching meals", 500


# post route for adding a meal to the user's collection
@meals.route("/addMeal", methods=["POST"])
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

        foods = request.json.get("foods")
        groups = request.json.get("groups")
        timelimit = meal_time + timedelta(hours=30)

        symptoms = db.user_symptoms.find(
            {"username": username, "datetime": {"$gte": meal_time, "$lte": timelimit}}
        )

        symptom_list = [s["_id"] for s in symptoms]

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

# delete a meal in production.meals
@meals.route("/user/delete/<string:mealId>", methods=["DELETE"])
@require_token_delete
def delete_user_meal(user, mealId):
    try:
        db.meals.delete_one({"_id": ObjectId(mealId)})
        return "User's meal deleted successfully", 200
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error deleting user's symptom",
            "data": None,
        }, 500
