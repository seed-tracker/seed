from flask import Flask
from app import app
from db import db


# serves all food groups
@app.route("/groups", methods=["GET"])
def get_food_groups():
    try:
        groups = db.groups.find()
        if groups:
            groups_list = [{key: str(group[key]) for key in group} for group in groups]
            return {"data": groups_list}, 200
        else:
            return "No food groups found", 404
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching food groups",
            "data": None,
        }, 500


# serves a single food group
@app.route("/groups/<string:name>", methods=["GET"])
def get_food_group(name):
    try:
        group = db.groups.find_one({"name": name})
        if group:
            group["_id"] = str(group["_id"])
            return {"data": group}, 200
        else:
            return "Food group not found", 404

    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching food group",
            "data": None,
        }, 500
