from flask import Blueprint
from db import db
from flask import request, jsonify
from datetime import datetime, timedelta
from api.auth_middleware import require_token

stats = Blueprint("stats", __name__)


# /stats?days=numberorall
@stats.route("", methods=["GET"])
@require_token
def get_user_foods(user):
    try:
        username = user["username"]
        if not user:
            return "Not authorized", 401

        days = request.args.get("days")

        # if the days query is days=all, show all data
        if days == "all":
            min_time = datetime(1900, 1, 1)
        else:
            days = int(days) if days else 60

            # find the date of the user's last entry (and counting backwards from there, for seeding reasons)
            max_time = [
                m
                for m in db.meals.aggregate(
                    [
                        {"$match": {"username": username}},
                        {"$sort": {"datetime": -1}},
                        {"$project": {"datetime": 1}},
                        {"$limit": 1},
                    ]
                )
            ][0]["datetime"]

            min_time = max_time - timedelta(days=days)

        def get_food_data(type):
            pipeline = [
                {"$match": {"username": username, "datetime": {"$gte": min_time}}},
                {"$unwind": f"${type}"},
                {"$group": {"_id": f"${type}", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$project": {"name": "$_id", "count": 1, "_id": 0}},
            ]

            if type == "foods":
                pipeline += [
                    {
                        "$lookup": {
                            "from": "foods",
                            "foreignField": "name",
                            "localField": "name",
                            "as": "lookup",
                        }
                    },
                    {
                        "$replaceRoot": {
                            "newRoot": {
                                "$mergeObjects": [
                                    {"$first": "$lookup"},
                                    {"count": "$count"},
                                ]
                            }
                        }
                    },
                    {"$project": {"_id": 0}},
                ]

            return [meal for meal in db.meals.aggregate(pipeline)]

        # count = count of number of times that symptom has occured in the given time period
        # avg_severity = avg severity of all of those times in the time period
        # min_severity = min of all those time, max_severity = max of all those times
        symptom_pipeline = [
            {"$match": {"username": username, "datetime": {"$gte": min_time}}},
            {
                "$group": {
                    "_id": "$symptom",
                    "count": {"$sum": 1},
                    "avg_severity": {"$avg": "$severity"},
                    "min_severity": {"$min": "$severity"},
                    "max_severity": {"$max": "$severity"},
                }
            },
            {"$sort": {"count": -1}},
            {
                "$project": {
                    "name": "$_id",
                    "_id": 0,
                    "count": 1,
                    "avg_severity": 1,
                    "min_severity": 1,
                    "max_severity": 1,
                }
            },
        ]

        count = db.meals.count_documents(
            {"username": username, "datetime": {"$gte": min_time}}
        )

        # counted_meals = number of meals counted within the given period
        result = {
            "username": username,
            "days": days,
            "counted_meals": count,
            "groups": get_food_data("groups"),
            "foods": get_food_data("foods"),
            "symptoms": [sym for sym in db.user_symptoms.aggregate(symptom_pipeline)],
        }

        return jsonify(result), 200

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching user's stats",
            "data": None,
        }, 500
