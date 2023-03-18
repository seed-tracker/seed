from flask import Flask, request, jsonify
from app import app
from db import db
import bcrypt
import jwt
import os
from datetime import datetime
salt = bcrypt.gensalt(prefix=b"2b")
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
secret = os.environ.get('JWT_SECRET')

@app.route('/auth/login', methods=['POST'])
def login():
    req_data = request.get_json()
    user = db.users.find_one({'username': req_data['username']})
    if user:
      password_checked = bcrypt.checkpw(req_data['password'].encode("utf-8"), user['password'].encode("utf-8"))
      if password_checked:
        return {"token": jwt.encode({"username": str(user['username'])}, secret, algorithm="HS256")}, 200
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
      if req_data['birthdate'] is None:
        birthdate = None
      else:
        birthdate = datetime.strptime(req_data['birthdate'], "%m/%d/%Y")
      new_user = db.users.insert_one({'name': name, 'username': username, 'password': password.decode('utf-8'), 'email': email, 'birthdate': birthdate})
      if new_user:
          return {"token": jwt.encode({"username": username}, secret, algorithm="HS256")}, 200
      else:
        return 'something went wrong', 401


@app.route('/auth/me', methods=['GET'])
def authenticate():
    req_data = request.get_json()
    if req_data['token'] is not None:
      token = req_data['token']
      userObj = jwt.decode(token, secret,  algorithms="HS256")
      username = userObj['username']
      user = db.users.find_one({"username": username})
      if user:
        return 'ok', 200
      else:
        return 'no access', 401
    else:
      return 'Authentication Token is missing!', 401



