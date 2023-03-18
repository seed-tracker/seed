from flask import Flask
from app import app
from db import db

# serves all symptoms
@app.route("/symptoms/", methods=["GET"])
def get_symptoms():
    symptoms = db.symptoms.find()
    if symptoms:
        symptomsList = [{key: str(symptom[key]) for key in symptom} for symptom in symptoms]
        return {"data": symptomsList}, 200
    else:
        return "Symptoms not found", 404

# right now only serves single symptom with capital. Ex: /symptoms/Fatigue
@app.route('/symptoms/<string:name>', methods=['GET'])
def get_symptom_by_name(name):
    symptom = db.symptoms.find_one({'name': name})
    if symptom:
        symptom['_id'] = str(symptom['_id'])
        return {"data": symptom}, 200
    else:
        return "Symptom not found", 404