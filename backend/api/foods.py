from flask import Blueprint
from db import db
from bson import ObjectId

foods = Blueprint("foods", __name__)


# get all foods
@foods.route("/", methods=["GET"])
def get_foods():
    try:
        foods = [{key: str(food[key]) for key in food} for food in db.foods.find()]

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
