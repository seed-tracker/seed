from flask import Blueprint
from db import db
from flask import jsonify


symptoms = Blueprint("symptoms", __name__)


# get all symptoms (not connected to user)
@symptoms.route("/", methods=["GET"])
def get_symptoms():
    try:
        symptoms = db.symptoms.find()

        symptoms_list = [
            {key: str(symptom[key]) for key in symptom} for symptom in symptoms
        ]

        if symptoms_list:
            return symptoms_list, 200
        else:
            return "No symptoms found", 404

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching symptoms",
            "data": None,
        }, 500


# get a single symptom (not connected to a user)
@symptoms.route("/<string:name>", methods=["GET"])
def get_symptom_by_name(name):
    try:
        symptom = db.symptoms.find_one({"name": name})

        # stringify the object ids
        if symptom:
            symptom["_id"] = str(symptom["_id"])
            return {"data": symptom}, 200
        else:
            return "Symptom not found", 404

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching symptoms",
            "data": None,
        }, 500
