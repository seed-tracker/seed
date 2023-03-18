from flask import Flask
from app import app
from db import db

#get all symptoms
@app.route('/symptoms', methods=['GET'])
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
@app.route('/symptoms/<string:name>', methods=['GET'])
def get_symptom_by_name(name):
    symptom = db.symptoms.find_one({'name': name})
    if symptom:
        symptom['_id'] = str(symptom['_id'])
        return {"data": symptom}, 200
    else:
        return "Symptom not found", 404

@routes_bp.route("/symptoms/")
def symptoms():
    return "Symptoms"
