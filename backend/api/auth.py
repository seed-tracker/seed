from flask import Flask, request
from app import app
from db import db
import bcrypt
# import jwt
import os
from datetime import datetime
salt = bcrypt.gensalt(5)
secret = os.environ.get('JWT_SECRET')

@app.route('/auth/login', methods=['POST'])
def login():
    req_data = request.get_json()
    user = db.users.find_one({'username': req_data['username']})
    if user:
      password_checked = bcrypt.checkpw(req_data['password'].encode("utf-8"), user['password'].encode("utf-8"))
      if password_checked:
        return {"token": jwt.encode({"username": req_data['username']}, secret, algorithm="HS256")}, 200
      else:
        return "Password is not correct", 401
    else:
      return "User not found", 401

@app.route('/auth/register', methods=['POST'])
def register():
    req_data = request.get_json()
    user = db.users.find_one({'username': req_data['username']})
    if user:
      return "User exists already", 401
    else:
      name = req_data['name']
      username = req_data['username']
      password = bcrypt.hashpw(req_data['password'].encode('utf-8'), salt)
      email = req_data['email']
      if req_data['birthdate']:
        birthdate = datetime.strptime(req_data['birthdate'], "%Y-%m-%d")
      else:
        birthdate = None
      new_user = db.users.insert_one({'name': name, 'username': username, 'password': password.decode('utf-8'), 'email': email, 'birthdate': birthdate})
      if new_user:
          return {"token": jwt.encode({"username": username}, secret, algorithm="HS256")}, 200
      else:
        return 'something went wrong', 401


@app.route('/auth/me', methods=['GET'])
def authenticate():

    if request.headers['Authorization'] is not None:
      token = request.headers['Authorization']
      userObj = jwt.decode(token, secret,  algorithms="HS256")
      username = userObj['username']
      user = db.users.find_one({"username": username})
      if user:
        user_string = {key: str(user[key]) for key in user}
        return user_string, 200
      else:
        return 'no access', 401
    else:
      return 'Authentication Token is missing!', 401



