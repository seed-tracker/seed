from flask import Blueprint, request, jsonify
from db import db
from bson import ObjectId
from pprint import PrettyPrinter

printer = PrettyPrinter()

foods = Blueprint("foods", __name__)



@foods.route("/", methods=["GET"])
def get_foods():
    """Fetches all foods from database

    Returns
    -------
    list
        a list of the foods
    """
    try:

        foods = [food for food in db.foods.find()]

        for f in foods:
            f["_id"] = str(f["_id"])

        if foods:
            return foods, 200

        else:
            return "No foods found", 404

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching foods",
            "data": None,
        }, 500


@foods.route("/autocomplete", methods=["GET"])
def autocomplete_foods():
    """Creates autocomplete list based on query

    Returns
    -------
    list
        a list of the queried foods
    """
    try:

        query = request.args.get("query")

        result = db.foods.aggregate(
            [
                {
                    "$search": {
                        "index": "food_search",
                        "autocomplete": {
                            "query": query,
                            "path": "name",
                            "tokenOrder": "sequential",
                        },
                    }
                },
                {"$project": {"_id": 0, "name": 1, "groups": 1}},
            ]
        )

        if result:
            return jsonify(list(result)), 200

        else:
            return "No food with this name found", 404
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching food",
            "data": None,
        }, 500


@foods.route("/<string:id>", methods=["GET"])
def get_food_by_id(id):
    """Grabs food based on food id

    Parameters
    -------
    string
        a string of the food id

    Returns
    -------
    dict
        a dict of the food
    """
    try:

        food = db.foods.find_one(ObjectId(id))

        if food:
            food["_id"] = str(food["_id"])
            return food, 200

        else:
            return "Food not found", 404
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching food",
            "data": None,
        }, 500
