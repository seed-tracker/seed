from flask import Blueprint
from db import db
from flask import request, jsonify
from datetime import datetime, timedelta
from api.auth_middleware import require_token
from dateutil.relativedelta import relativedelta

stats = Blueprint("stats", __name__)


# /stats?days=numberorall
# get a users most eaten foods and food groups and symptoms over a certain number of days
@stats.route("", methods=["GET"])
@require_token
def get_user_foods(user):
    try:
        username = user["username"]
        if not user:
            return "Not authorized", 401

        days = request.args.get("days")

        # if the days query is days=all, show all data (unless users have input data pre-1900...)
        if days == "all":
            min_time = datetime(1900, 1, 1)
        else:
            days = int(days) if days else 60
            min_time = get_last_date(username) - timedelta(days=days)

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


# /stats/monthly?months=# (default = 12)
# get a user's monthly symptom count
@stats.route("/monthly", methods=["GET"])
@require_token
def get_monthly_data(user):
    try:
        username = user["username"]

        months = request.args.get("months")
        months = int(months) if months else 12

        min_date = get_last_date(username) - relativedelta(months=months)
        delta = relativedelta(get_last_date(username), datetime.now())

        pipeline = [
            {"$match": {"username": username, "datetime": {"$gte": min_date}}},
            {
                "$project": {
                    "username": 1,
                    "symptom": 1,
                    "date": {
                        "$dateSubtract": {
                            "startDate": {"$toDate": "$datetime"},
                            "unit": "month",
                            "amount": delta.months,
                        }
                    },
                }
            },
            {
                "$group": {
                    "_id": {
                        "symptom": "$symptom",
                        "month": {"$month": "$date"},
                        "year": {"$year": "$date"},
                    },
                    "count": {"$sum": 1},
                }
            },
            {
                "$project": {
                    "symptom": "$_id.symptom",
                    "month": "$_id.month",
                    "year": "$_id.year",
                    "count": 1,
                }
            },
            {"$sort": {"year": 1, "month": 1}},
            {
                "$group": {
                    "_id": "$_id.symptom",
                    "months": {
                        "$push": {
                            "month": "$_id.month",
                            "year": "$_id.year",
                            "count": "$count",
                        }
                    },
                }
            },
            {"$project": {"symptom": "$_id", "months": 1, "_id": 0}}
        ]

        # returns data formatted monthly, from current date backwards x number of months
        return (
            jsonify(
                {
                    "num_months": months,
                    "username": username,
                    "data": [sym for sym in db.user_symptoms.aggregate(pipeline)],
                }
            ),
            200,
        )

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching user's monthly data",
            "data": None,
        }, 500


def get_last_date(username):
    # find the date of the user's last entry
    return [
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
