from flask import Blueprint, request, jsonify
from db import db
from bson import ObjectId
from pprint import PrettyPrinter
printer = PrettyPrinter()

foods = Blueprint("foods", __name__)


# get all foods
@foods.route("/", methods=["GET"])
def get_foods():
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

# given a query, return a list/array of suggestions using autocomplete feature

@foods.route("/autocomplete", methods=["GET"])
def autocomplete_foods():
    try:
        food_collection = db.foods
        # print(request.args.get("query"))
        query = request.args.get("query")
        # print(query)
        result = food_collection.aggregate([
            {
                "$search": {
                    "index": "food_search",
                    "autocomplete": {
                        "query": query,
                        "path": "name",
                        "tokenOrder": "sequential",
                        # "fuzzy": {}
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "name": 1
                }
            }
        ])
        # printer.pprint(list(result))
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

# get a single food item
@foods.route("/<string:id>", methods=["GET"])
def get_food_by_id(id):
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

