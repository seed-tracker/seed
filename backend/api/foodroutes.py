from flask import Flask, jsonify
from db import db
from app import app
from bson import ObjectId

# get all foods
# @app.route('/foods', methods=['GET'])
# def get_foods():
#     foods = db.foods.find()
#     if foods:
#         food_list = [{key: str(food[key]) for key in food} for food in foods]
#         return {"data": food_list}, 200
#     else:
#         return "No foods found", 404

@app.route('/foods', methods=['GET'])
def get_foods():
    foods = db.foods.find()
    food_list = []
    status_code = 404
    
    for food in foods:
        food_dict = {key: str(food[key]) for key in food}
        food_list.append(food_dict)
        status_code = 200
    
    response = {"data": food_list} if status_code == 200 else "No foods found"
    return response, status_code

# get a single food item
@app.route('/foods/<string:id>', methods=['GET'])
def get_food_by_id(id):
    food = db.foods.find_one(ObjectId(id))
    if food:
        food_string = {key: str(food[key]) for key in food}
        return food_string, 200
    else:
        return "Food not found", 404

