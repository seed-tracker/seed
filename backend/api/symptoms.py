from flask import Flask
from app import app
from db import db

@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    symptoms = db.symptoms.find()
    symptomsList = [{key: str(symptom[key]) for key in symptom} for symptom in symptoms]
    return {
        "data": symptomsList
    }, 200