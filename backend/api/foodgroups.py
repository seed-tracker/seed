from flask import Flask
from app import app
from db import db

@app.route("/groups", methods=["GET"])
def get_food_groups():
    groups = db.groups.find()
    groupsList = [{key: str(group[key]) for key in group} for group in groups]
    return {
        "data": groupsList
    }, 200