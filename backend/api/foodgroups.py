from flask import Blueprint
from db import db

groups = Blueprint("groups", __name__)


@groups.route("/", methods=["GET"])
def get_food_groups():
    """Receives all food groups from database

    Returns
    -------
    dict
        a dict of the food group list
    """
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



@groups.route("/<string:name>", methods=["GET"])
def get_food_group(name):
    """Receives a single food group from database based on name provided

    Parameters
    -------
    string
        a string of the food group name

    Returns
    -------
    dict
        a dict of the food group
    """
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
