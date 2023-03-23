from flask import Flask
from app import app
from db import db
from flask import request, jsonify
from datetime import datetime, timedelta
from api.auth_middleware import require_token

# gets a single user's meals, paginated
@app.route("/meals/user", methods=["GET"])
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
                    {"$project": {"_id": 0, "related_symptoms": 0}},
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
@app.route("/user/addMeal", methods=["POST"])
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