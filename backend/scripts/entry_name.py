# File to add entry names to all meals based on time
import sys
from bson import ObjectId
sys.path.insert(0,"..")
from db import db, test_db

""" Add entry names to meal entries
    """
def add_entry_name():
    pipeline = [
        {
            "$set": {
                "entry_name": {
                    "$switch": {
                        "branches": [
                            {"case":
                                {"$lte": [{"$hour": { "$toDate": "$datetime" }}, 10]},
                                "then": "Breakfast"
                            },
                            {"case":  {"$and" : [
                                {"$gt": [{"$hour": { "$toDate": "$datetime" }}, 10]},
                                {"$lt": [{"$hour": { "$toDate": "$datetime" }}, 12]}
                                ]},
                                "then": "Snack"
                            },
                            {"case":  {"$and" : [
                                {"$gte": [{"$hour": { "$toDate": "$datetime" }}, 12]},
                                {"$lt": [{"$hour": { "$toDate": "$datetime" }}, 15]}
                                ]},
                                "then": "Lunch"
                            },
                            {"case":  {"$and" : [
                                {"$gte": [{"$hour": { "$toDate": "$datetime" }}, 15]},
                                {"$lte": [{"$hour": { "$toDate": "$datetime" }}, 17]}
                                ]},
                                "then": "Snack"
                            },
                            {"case":  {"$and" : [
                                {"$gte": [{"$hour": { "$toDate": "$datetime" }}, 18]},
                                {"$lt": [{"$hour": { "$toDate": "$datetime" }}, 20]}
                                ]},
                                "then": "Dinner"
                            }
                        ],
                        "default": "Snack"
                    }
                }
            }
        }
    ]

    db.meals.update_many({}, pipeline)

add_entry_name()
