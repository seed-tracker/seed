from flask import Flask
from app import app
from db import db
from flask import request
from flask import jsonify
from pymongo import MongoClient


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