from flask import Flask
from app import app
from db import db

@app.route('/groups', methods=['GET'])
def get_food_groups():
    groups = db.groups.find()
    if groups:
        groups_list = [{key: str(group[key]) for key in group} for group in groups]
        return {"data": groups_list}, 200
    else:
        return "No food groups found", 404
    
  #serves a single food group  
@app.route('/groups/<string:name>', methods=['GET'])
def get_food_group(name):
    group = db.groups.find_one({'name': name})
    if group:
        group['_id'] = str(group['_id'])
        return {"data": group}, 200
    else:
        return "Food group not found", 404
    
    