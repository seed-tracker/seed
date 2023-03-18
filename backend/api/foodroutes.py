from flask import Flask, jsonify
from db import db
from app import app
from bson import ObjectId

# get all foods
@app.route("/foods", methods=["GET"])
def get_foods():
    foods = db.foods.find()
    # loops through every key in the object & makes sure it is a string
    foodList = [{key: str(food[key]) for key in food} for food in foods]
    return {
        "data": foodList
    }, 200

# get a single food item
@app.route("/foods/<string:id>", methods=["GET"])
def get_foodById(id):
    food = db.foods.find_one(ObjectId(id))

    foodString = {key: str(food[key]) for key in food}
    return foodString, 200
