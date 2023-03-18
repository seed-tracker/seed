from flask import Flask, jsonify
from db import db
from app import app
from bson import ObjectId

# get all foods
@app.route('/foods', methods=['GET'])
def get_foods():
    foods = db.foods.find()
    if foods:
        food_list = [{key: str(food[key]) for key in food} for food in foods]
        return {"data": food_list}, 200
    else:
        return "No foods found", 404

# get a single food item
@app.route('/foods/<string:id>', methods=['GET'])
def get_food_by_id(id):
    food = db.foods.find_one(ObjectId(id))
    if food:
        food_string = {key: str(food[key]) for key in food}
        return food_string, 200
    else:
        return "Food not found", 404
