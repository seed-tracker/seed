# from flask import Flask
# from app import app
# from db import db
# from flask import request
# from flask import jsonify
# from pymongo import MongoClient
# from datetime import date
# from flask_pymongo import PyMongo

# #get all users
# # @app.route('/users', methods=['GET'])
# # def get_users():
# #     users = db.users.find()
# #     user_list = []
# #     for user in users:
# #         user_list.append({key: str(user[key]) for key in user})
# #     if user_list:
# #        return {"data": user_list}, 200
# #     else:
# #         return "No users found", 404

# #gets users without password displayed on browser
# @app.route('/users', methods=['GET'])
# def get_users():
#     users = db.users.find({}, {'password': 0})
#     user_list = [{key: str(user[key]) for key in user if key != 'password'} for user in users]
#     if user_list:
#         return {"data": user_list}, 200
#     else:
#         return "No users found", 404

#     #gets a single user
# @app.route('/users/<string:username>', methods=['GET'])
# def get_user(username):
#     user = db.users.find_one({'username': username})
#     if user:
#         user['username'] = str(user['username'])
#         return {"data": username}, 200
#     else:
#         return "User not found", 404

#     #gets a single user's meals
# @app.route('/meals/<string:username>', methods=['GET'])
# def get_user_meals(username):
#     meals = list(db.meals.find({'username': username}))
#     if meals:
#         for meal in meals:
#             meal['_id'] = str(meal['_id'])
#         return jsonify(meals), 200
#     else:
#         return "No meals found for user {}".format(username), 404

# #get each single user's symptoms
# @app.route('/users/<string:username>/symptoms', methods = ['GET'])
# def get_user_symptoms(username):
#     user_symptoms = db.user_symptoms.find({"username": username})
#     # return {"data": user_symptoms}
#     user_symptoms_list = []
#     for symptom in user_symptoms:
#         user_symptoms_list.append({key: str(symptom[key]) for key in symptom})
#     if user_symptoms_list:
#         return {"data": user_symptoms_list}, 200
#     else:
#         return "No user symptoms found", 404

#     #post route for adding a meal to the user's table
# @app.route("/user/<string:username>/addFood", methods=["POST"])
# def add_entry(username):
#     date = request.json.get("date")
#     time = request.json.get("time")
#     food_group = request.json.get("foodGroup")
#     food_items = request.json.get("foodItems")
#     entry = {"username": username, "date": date, "time": time, "food_group": food_group, "food_items": food_items}
#     db.meals.insert_one(entry)
#     return jsonify({"message": "Entry added successfully!"}), 201

# #post route for editing a single user's profile
# @app.route('/<username>', methods=['PUT'])
# def edit_profile(username):
#     try:
#         request_data = request.get_json()
#         if request_data is None or 'username' not in request_data:
#             return jsonify({'error': 'Invalid request body'}), 400
#         username = request_data['username']
#         return jsonify({'success': True})
#     except Exception as e:
#         print(e)
#         return jsonify({'error': str(e)}), 500

from flask import Flask
from app import app
from db import db
from flask import request
from flask import jsonify
from pymongo import MongoClient
from datetime import date
from flask_pymongo import PyMongo
import bcrypt
salt = bcrypt.gensalt(5)

#get all users
# @app.route('/users', methods=['GET'])
# def get_users():
#     users = db.users.find()
#     user_list = []
#     for user in users:
#         user_list.append({key: str(user[key]) for key in user})
#     if user_list:
#        return {"data": user_list}, 200
#     else:
#         return "No users found", 404

#gets users without password displayed on browser
@app.route('/users', methods=['GET'])
def get_users():
    users = db.users.find({}, {'password': 0})
    user_list = [{key: str(user[key]) for key in user if key != 'password'} for user in users]
    if user_list:
        return {"data": user_list}, 200
    else:
        return "No users found", 404

    #gets a single user
@app.route('/users/<string:username>', methods=['GET'])
def get_user(username):
    user = db.users.find_one({'username': username})
    if user:
        user['username'] = str(user['username'])
        return {"data": username}, 200
    else:
        return "User not found", 404

    #gets a single user's meals
@app.route('/meals/<string:username>', methods=['GET'])
def get_user_meals(username):
    meals = list(db.meals.find({'username': username}))
    if meals:
        for meal in meals:
            meal['_id'] = str(meal['_id'])
        return jsonify(meals), 200
    else:
        return "No meals found for user {}".format(username), 404

#get each single user's symptoms
@app.route('/users/<string:username>/symptoms', methods = ['GET'])
def get_user_symptoms(username):
    user_symptoms = db.user_symptoms.find({"username": username})
    # return {"data": user_symptoms}
    user_symptoms_list = []
    for symptom in user_symptoms:
        user_symptoms_list.append({key: str(symptom[key]) for key in symptom})
    if user_symptoms_list:
        return {"data": user_symptoms_list}, 200
    else:
        return "No user symptoms found", 404

    #post route for adding a meal to the user's table
@app.route("/user/<string:username>/addFood", methods=["POST"])
def add_entry(username):
    date = request.json.get("date")
    time = request.json.get("time")
    food_group = request.json.get("foodGroup")
    food_items = request.json.get("foodItems")
    entry = {"username": username, "date": date, "time": time, "food_group": food_group, "food_items": food_items}
    db.meals.insert_one(entry)
    return jsonify({"message": "Entry added successfully!"}), 201

#post route for editing a single user's profile
# @app.route('/<username>/editProfile', methods=['PUT'])
# def edit_profile(username):
#     try:
#         request_data = request.get_json()
#         if request_data is None:
#             return jsonify({'error': 'Invalid request body'}), 400

#         # Find the user by their username and update their information
#         db.users.update_one({'username': username}, {'$set': request_data})

#         return jsonify({'success': True})
#     except Exception as e:
#         print(e)
#         return jsonify({'error': str(e)}), 500

@app.route('/<username>/editProfile', methods=['PUT'])
def edit_profile(username):
    try:
        request_data = request.get_json()
        if request_data is None:
            return jsonify({'error': 'Invalid request body'}), 400
        hashedPassword = bcrypt.hashpw(request_data['password'].encode('utf-8'), salt)
        # Find the user by their username and update their information
        updated_user = db.users.find_one_and_update({'username': username}, {'$set':{"password": hashedPassword.decode('utf-8'), 'name': request_data['name'],
        'email': request_data['email']}}, return_document=True)
        user_string = {key: str(updated_user[key]) for key in updated_user}
        return user_string, 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


# get route for correlations, single user
@app.route('/<string:username>/correlations/', methods=['GET'])
def get_user_correlations(username):
    try:
        correlations = db.correlations.find({"username": username})
        correlations_list = []
        for correlation in correlations:
            correlation["_id"] = str(correlation["_id"])
            correlations_list.append({key: correlation[key] for key in correlation})
        if correlations_list:
            return correlations_list, 200
        else:
            return "No correlations found", 404
    except Exception as e:
        return "Error", 500