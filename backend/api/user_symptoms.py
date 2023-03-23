from flask import Blueprint, request
from db import db
from flask import jsonify
from datetime import datetime, timedelta
from api.auth_middleware import require_token

user_symptoms = Blueprint("user_symptoms", __name__)


# post a symptom in production.user_symptoms
@user_symptoms.route("/", methods=["POST"])
@require_token
def add_user_symptom(user):
    try:
        username = user["username"]

        data = request.get_json()
        date = data["date"]
        time = data["time"]

        if not time:
            time = datetime.now().time().strftime("%H:%M")
        if not date:
            date = datetime.now().date().strftime("%Y-%m-%d")

        symptom_time = datetime.strptime(date + " " + time, "%Y-%m-%d %H:%M")
        symptom = data["symptom"]
        severity = data["severity"]

        if not symptom:
            return "Symptom name required", 400
        if not severity:
            return "Severity level required", 400

        new_symptom = db.user_symptoms.insert_one(
            {
                "username": username,
                "datetime": symptom_time,
                "symptom": symptom,
                "severity": severity,
            }
        )

        timelimit = symptom_time - timedelta(hours=30)
        meals = db.meals.find(
            {
                "username": username,
                "datetime": {"$gte": timelimit, "$lte": symptom_time},
            }
        )

        for meal in meals:
            db.meals.find_one_and_update(
                {"_id": meal["_id"]},
                {"$push": {"related_symptoms": new_symptom.inserted_id}},
                return_document=True,
            )

        return "User's symptom added successfully", 201
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error adding user's symptom",
            "data": None,
        }, 500


# gets each single user's symptoms, paginated
@user_symptoms.route("/", methods=["GET"])
@require_token
def get_user_symptoms(user):
    try:
        username = user["username"]

        page = request.args.get("page")

        if page:
            page = int(page)
        else:
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
            return f"No symptoms found for user {username}", 500

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching symptoms",
            "data": None,
        }, 500
