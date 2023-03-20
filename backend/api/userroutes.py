from flask import Flask
from app import app
from db import db


#get all users  
@app.route('/users', methods=['GET'])
def get_users():
    users = db.users.find()
    user_list = []
    for user in users:
        user_list.append({key: str(user[key]) for key in user})
    if user_list:
       return {"data": user_list}, 200
    else:
        return "No users found", 404
    
#get a single user
@app.route('/users/<string:username>', methods=['GET'])
def get_user(username):
    user = db.users.find_one({'username': username})
    if user:
        user['username'] = str(user['username'])
        return {"data": username}, 200
    else:
        return "User not found", 404