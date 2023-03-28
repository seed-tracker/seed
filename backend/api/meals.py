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
        #grab page request arguments
        page = request.args.get("page")
        #guard rails for pagination
        if page:
            page = int(page)
        else:
            page = 1

        offset = (page - 1) * 20
        #count all past meals for the user
        total_meals = db.meals.count_documents({"username": username})

        if offset > total_meals:
            offset = total_meals - 20
        #create a list of meals from the database based on pagination
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
        #if meal list is available return a dict of the count and the list of meals
        if meals:
            return {"count": total_meals, "meals": meals}, 200
        #if no meal list found return an error message
        else:
            return f"No meals found for user {username}", 500

    except Exception as e:
        print("Error! ", str(e))
        return "Error fetching meals", 500


@meals.route("/recent", methods=["GET"])
@require_token
def get_recent_foods(user):
    try:
        print("getting recents...")
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

        print(recent_foods)

        if not recent_foods:
            return "Foods not found", 404

        return jsonify(recent_foods), 200

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching user's recent foods",
            "data": None,
        }, 500


# post route for adding a meal to the user's collection
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
        #receive user input data from frontend
        entry_name = request.json.get("entry_name")
        date = request.json.get("date")
        time = request.json.get("time")

        if not time:
            time = datetime.now().time().strftime("%H:%M")
        if not date:
            date = datetime.now().date().strftime("%Y-%m-%d")
        #create datetime parameter based on database specifications
        meal_time = datetime.strptime(date + " " + time, "%Y-%m-%d %H:%M")

        foods = request.json.get("foods")
        groups = request.json.get("groups")
        #create a limit to be able to associate symptoms with meal entry
        timelimit = meal_time + timedelta(hours=30)
        #find related symptoms based on time parameters
        symptoms = db.user_symptoms.find(
            {"username": username, "datetime": {"$gte": meal_time, "$lte": timelimit}}
        )
        #stringify symptom id in symptom list
        symptom_list = [s["_id"] for s in symptoms]

        entry = {
            "entry_name": entry_name,
            "username": username,
            "datetime": meal_time,
            "groups": groups,
            "foods": foods,
            "related_symptoms": symptom_list,
        }
        #create a new entry in the database with received details
        db.meals.insert_one(entry)
        #return dict of success message once meal has been created in the database
        return jsonify({"message": "Entry added successfully!"}), 201
    except Exception as e:
        print("Error! ", str(e))
        return "Error adding meal", 401


# delete a meal in production.meals
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
        #delete request based on the meal id
        db.meals.delete_one({"_id": ObjectId(mealId)})
        #returns a string once a meal is deleted
        return "User's meal deleted successfully", 200
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error deleting user's symptom",
            "data": None,
        }, 500
