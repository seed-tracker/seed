from flask import Flask, request
from app import app
from db import db
from db import test_db
from datetime import datetime

#get all symptoms
@app.route('/symptoms/', methods=['GET'])
def get_symptoms():
    symptoms = db.symptoms.find()
    symptoms_list = []
    for symptom in symptoms:
        symptoms_list.append({key: str(symptom[key]) for key in symptom})
    if symptoms_list:
        return {"data": symptoms_list}, 200
    else:
        return "No symptoms found", 404

#get a single symptom
@app.route('/symptoms/<string:name>/', methods=['GET'])
def get_symptom_by_name(name):
    symptom = db.symptoms.find_one({'name': name})
    if symptom:
        symptom['_id'] = str(symptom['_id'])
        return {"data": symptom}, 200
    else:
        return "Symptom not found", 404

#get production.user_symptoms
@app.route('/user/<string:username>/symptoms/', methods = ['GET'])
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

# post a symptom in production.user_symptoms
@app.route('/user/<string:username>/symptoms/', methods=['POST'])
def add_user_symptom(username):
    try:
        data = request.get_json()
        user_symptoms_collection = db.user_symptoms
        date = data['date']
        time = data['time']
        symptom = data['symptom']
        severity = data['severity']
        user_symptoms_collection.insert_one({
            "username": username,
            "date": date,
            "time": time,
            "symptom": symptom,
            "severity": severity,
        })
        return "User's symptom added succesfully", 201
    except Exception as e:
        return "Failed to add User's symptom", 404