from flask import Blueprint, request, jsonify
from db import db
from bson import ObjectId
from pprint import PrettyPrinter

printer = PrettyPrinter()

foods = Blueprint("foods", __name__)


# get all foods
@foods.route("/", methods=["GET"])
def get_foods():
    """Receives all foods from database

    Returns
    -------
    list
        a list of the foods
    """
    try:
        # finds a single food in the database and creates a dict
        foods = [food for food in db.foods.find()]
        # then iterates over foods and stringifies id
        for f in foods:
            f["_id"] = str(f["_id"])
        # if all foods are found return food dict
        if foods:
            return foods, 200
        # if no foods found then return error
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
        # grab query from the req arguments
        query = request.args.get("query")
        # query database and aggregate search results
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
        # if result is found return a list of the database results
        if result:
            return jsonify(list(result)), 200
        # if query does not match anything return error
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
        # find the food based on the id from the database
        food = db.foods.find_one(ObjectId(id))
        # if food is found return a dict of the food with a stringified id
        if food:
            food["_id"] = str(food["_id"])
            return food, 200
        # if food is not found return error
        else:
            return "Food not found", 404
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching food",
            "data": None,
        }, 500
