from flask import Blueprint
from db import db
from flask import request, jsonify
from datetime import datetime, timedelta
from api.auth_middleware import require_token
from dateutil.relativedelta import relativedelta

stats = Blueprint("stats", __name__)


@stats.route("", methods=["GET"])
@require_token
def get_user_foods(user):
    """Fetches the user's most recorded foods, food groups and symptoms over a given time period

    Returns
    -------
    dict
        a dict with the foods, groups, symptoms, username, number of meals
    """
    try:
        username = user["username"]
        if not user:
            return "Not authorized", 401

        days = request.args.get("days")

        # if the days query is days=all, show all data. Set default to 60 days
        if days == "all":
            min_time = datetime(1900, 1, 1)
        else:
            days = int(days) if days else 60
            min_time = get_last_date(username) - timedelta(days=days)

        # a helper function to get food or group data for that user
        def get_food_data(type):
            # get the count and name of the user's foods/groups, ordered by most frequent
            pipeline = [
                {"$match": {"username": username, "datetime": {"$gte": min_time}}},
                {"$unwind": f"${type}"},
                {"$group": {"_id": f"${type}", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$project": {"name": "$_id", "count": 1, "_id": 0}},
            ]

            # for foods, also get the attached groups
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

        # count = number of times that symptom has occured in the given time period
        # avg_severity = avg severity of all of those times
        # min/max_severity = min/max of all those time
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

        # get total number of meals eaten in that time period
        count = db.meals.count_documents(
            {"username": username, "datetime": {"$gte": min_time}}
        )

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


@stats.route("/monthly", methods=["GET"])
@require_token
def get_monthly_data(user):
    """Aggregates data on user's symptom and meal entries grouped by month

    Returns
    -------
    dict
        a dict with the data and time range
    """
    try:
        # get username from auth middleware
        username = user["username"]

        delta = relativedelta(get_last_date(username), datetime.now())
        delta.months = 0

        # get user's correlated symptoms
        pipeline = [
            {"$match": {"username": username}},
            {
                "$project": {
                    "symptom": 1,
                    "top_foods": {"name": 1, "lift": 1},
                    "top_groups": {"name": 1, "lift": 1},
                    "_id": 0,
                }
            },
        ]

        correlations = list(db.correlations.aggregate(pipeline))

        if not correlations or len(correlations) < 1:
            return "Insufficient data", 404

        # format the data to use in the next step
        # {symptom: name, top_foods: [food1, food2,...], top_groups: [group1, group2, ...]}
        data = list(map(lambda corr: {"symptom": corr["symptom"]}, correlations))

        # helper function to format foods, symptoms into flat array
        def format(dict, key):
            if key in corr:
                data[i][key] = list(map(lambda f: f["name"], corr[key]))
            else:
                data[i][key] = []

        # format the correlations data
        for i, corr in enumerate(correlations):
            format(data, "top_groups")
            format(data, "top_foods")

        # get the symptoms grouped by month, with count, average severity and adjusted date
        symptom_pipeline = [
            {
                "$match": {
                    "username": username,
                    "symptom": {"$in": [c["symptom"] for c in data]},
                }
            },
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
                    "severity": 1,
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
                    "avg_severity": {"$avg": "$severity"},
                }
            },
            {
                "$project": {
                    "symptom": "$_id.symptom",
                    "month": "$_id.month",
                    "year": "$_id.year",
                    "count": 1,
                    "avg_severity": 1,
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
                            "symptom": "$symptom",
                            "avg_severity": "$avg_severity",
                        }
                    },
                }
            },
            {"$project": {"symptom": "$_id", "months": 1, "_id": 0}},
        ]

        # call the aggregation pipeline
        user_symptoms = list(db.user_symptoms.aggregate(symptom_pipeline))

        # format symptoms, top_foods and top_groups for use in d3 on frontend data
        for i, sym in enumerate(data):
            for s in user_symptoms:
                if sym["symptom"] == s["symptom"]:
                    data[i]["symptom_data"] = s["months"]

            if len(sym["top_foods"]):
                data[i]["top_foods"] = get_food_data(
                    "food", sym["top_foods"], username, delta.months
                )

            if len(sym["top_groups"]):
                data[i]["top_groups"] = get_food_data(
                    "group", sym["top_groups"], username, delta.months
                )

        return (
            jsonify({"data": data}),
            200,
        )

    except Exception as e:
        print(str(e))
        return {
            "message": str(e),
            "error": "Error fetching user's monthly data",
            "data": None,
        }, 500


# find the date of the user's most recent entry
def get_last_date(username):
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


# array = array of foods to search
# type = food or group
# array = foods/groups to search
# returns food/group data, grouped by month and year, including count
def get_food_data(type, array, username, delta):
    pipeline = [
        {"$match": {"username": username}},
        {"$unwind": f"${type}s"},
        {
            "$project": {
                "date": {
                    "$dateSubtract": {
                        "startDate": {"$toDate": "$datetime"},
                        "unit": "month",
                        "amount": delta,
                    }
                },
                f"{type}": f"${type}s",
            }
        },
        {"$match": {f"{type}": {"$in": array}}},
        {
            "$group": {
                "_id": {
                    f"{type}": f"${type}",
                    "month": {"$month": "$date"},
                    "year": {"$year": "$date"},
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}},
        {
            "$group": {
                "_id": f"$_id.{type}",
                "months": {
                    "$push": {
                        "month": "$_id.month",
                        "year": "$_id.year",
                        "count": "$count",
                        "name": f"$_id.{type}",
                    }
                },
            }
        },
        {"$sort": {"_id": 1}},
    ]

    return list(db.meals.aggregate(pipeline))
