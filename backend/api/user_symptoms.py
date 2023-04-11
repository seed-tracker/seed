from flask import Blueprint, request, jsonify
from db import db
from datetime import datetime, timedelta
from api.auth_middleware import require_token, require_token_delete
from bson.objectid import ObjectId

user_symptoms = Blueprint("user_symptoms", __name__)


# delete a symptom in production.user_symptoms
@user_symptoms.route("/delete/<string:symptomId>", methods=["DELETE"])
@require_token_delete
def delete_user_symptom(user, symptomId):
    try:
        db.user_symptoms.delete_one({"_id": ObjectId(symptomId)})
        return "User's symptom deleted successfully", 200
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error deleting user's symptom",
            "data": None,
        }, 500


# add symptom to user_symptoms collection
@user_symptoms.route("/", methods=["POST"])
@require_token
def add_user_symptom(user):
    try:
        # get username from auth middleware
        username = user["username"]

        data = request.get_json()
        date = data["date"]
        time = data["time"]

        # set default time/date to now
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

        # add the symptom
        new_symptom = db.user_symptoms.insert_one(
            {
                "username": username,
                "datetime": symptom_time,
                "symptom": symptom,
                "severity": severity,
            }
        )

        # add the symptom to all related meals (any that occured in the previous 30 hours)
        timelimit = symptom_time - timedelta(hours=30)
        meals = db.meals.find(
            {
                "username": username,
                "datetime": {"$gte": timelimit, "$lte": symptom_time},
            }
        )

        # update the meals with the array
        for meal in meals:
            db.meals.find_one_and_update(
                {"_id": meal["_id"]},
                {"$addToSet": {"related_symptoms": new_symptom.inserted_id}},
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
@user_symptoms.route("", methods=["GET"])
@require_token
def get_user_symptoms(user):
    try:
        # get username from auth middleware
        username = user["username"]

        page = request.args.get("page")

        # default page = 1
        if page:
            page = int(page)
        else:
            page = 1

        offset = (page - 1) * 20

        # get count of user's symptoms, for pagination
        total_symptoms = db.user_symptoms.count_documents({"username": username})

        # change page to final page if there are no symptoms for the given page
        if offset > total_symptoms:
            offset = total_symptoms - 20

        symptoms = [
            symptom
            for symptom in db.user_symptoms.aggregate(
                [
                    {"$match": {"username": username}},
                    {
                        "$project": {
                            "_id": {"$toString": "$_id"},
                            "datetime": 1,
                            "severity": 1,
                            "symptom": 1,
                        }
                    },
                    {"$sort": {"datetime": -1}},
                    {"$skip": offset},
                    {"$limit": 20},
                ]
            )
        ]

        if symptoms:
            return {"count": total_symptoms, "symptoms": symptoms}, 200
        else:
            return {"error": "No symptoms found"}, 204

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching symptoms",
            "data": None,
        }, 500


# gets a user's recent symptoms
@user_symptoms.route("/recent", methods=["GET"])
@require_token
def get_recent_symptoms(user):
    try:
        # get username from the auth middlewar
        username = user["username"]

        pipeline = [
            {"$match": {"username": username}},
            {"$sort": {"datetime": -1}},
            {"$limit": 200},
            {"$group": {"_id": "$symptom", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
            {"$project": {"symptom": "$_id", "_id": 0}},
        ]

        # fetch the symptoms from mongodb
        recent_symptoms = list(db.user_symptoms.aggregate(pipeline))

        if not recent_symptoms:
            return "Symptoms not found", 204

        return jsonify(list(map(lambda s: s["symptom"], recent_symptoms))), 200

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching user's recent symptoms",
            "data": None,
        }, 500
