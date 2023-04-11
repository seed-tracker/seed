from flask import Blueprint, request, jsonify
from db import db
from datetime import datetime, timedelta
from api.auth_middleware import require_token, require_token_delete
from bson.objectid import ObjectId

meals = Blueprint("meals", __name__)


@meals.route("/user", methods=["GET"])
@require_token
def get_user_meals(user):
    """Pulls past meal entries for specified user

    Parameters
    -------
    dict
        a dict of the user based on the user retrieved from the authentication middleware

    Returns
    -------
    dict
        a dict of past meal entries
    """
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
                    {
                        "$project": {
                            "_id": {"$toString": "$_id"},
                            "entry_name": 1,
                            "datetime": 1,
                            "groups": 1,
                            "foods": 1,
                        }
                    },
                    {"$sort": {"datetime": -1}},
                    {"$skip": offset},
                    {"$limit": 20},
                ]
            )
        ]

        if meals:
            return {"count": total_meals, "meals": meals}, 200

        else:
            return f"No meals found for user {username}", 204

    except Exception as e:
        print("Error! ", str(e))
        return "Error fetching meals", 500


@meals.route("/recent", methods=["GET"])
@require_token
def get_recent_foods(user):
    try:
        """Fetches user's most common, recent foods

        Returns
        -------
        list
            a list of the foods
        """

        username = user["username"]

        pipeline = [
            {"$match": {"username": username}},
            {"$sort": {"datetime": -1}},
            {"$limit": 50},
            {"$project": {"foods": 1, "_id": 0}},
            {"$unwind": "$foods"},
            {"$group": {"_id": "$foods", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
            {
                "$lookup": {
                    "from": "foods",
                    "localField": "_id",
                    "foreignField": "name",
                    "as": "food",
                }
            },
            {
                "$project": {
                    "name": {"$first": "$food.name"},
                    "groups": {"$first": "$food.groups"},
                    "_id": 0,
                }
            },
        ]

        recent_foods = list(db.meals.aggregate(pipeline))

        if not recent_foods:
            return "Foods not found", 204

        return jsonify(recent_foods), 200

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching user's recent foods",
            "data": None,
        }, 500


@meals.route("/addMeal", methods=["POST"])
@require_token
def add_entry(user):
    """Adds a meal entry for specified user

    Parameters
    -------
    dict
        a dict of the user based on the user retrieved from the authentication middleware

    Returns
    -------
    dict
        a dict of a success message
    """
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

        return "Entry added successfully!", 201
    except Exception as e:
        print("Error! ", str(e))
        return "Error adding meal", 401


@meals.route("/user/delete/<string:mealId>", methods=["DELETE"])
@require_token_delete
def delete_user_meal(user, mealId):
    """Deletes a meal entry for specified user

    Parameters
    -------
    dict
        a dict of the user based on the user retrieved from the authentication middleware
    string
        a string of the meal id

    Returns
    -------
    string
        a string of a success message
    """
    try:
        db.meals.delete_one({"_id": ObjectId(mealId)})

        return "User's meal deleted successfully", 200
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error deleting user's symptom",
            "data": None,
        }, 500
