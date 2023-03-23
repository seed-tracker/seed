from db import db
import pprint
from pprint import PrettyPrinter
from pymongo import MongoClient

food_collection = db.foods
printer = PrettyPrinter()


# def fuzzy_matching():
#     result = food_collection.aggregate([
#         {
#             "$search": {
#                 "index": "food_search",
#                 "text": {
#                     "query": "computer",
#                     "path": "name",
#                     "fuzzy": {}
#                 }
#             }
#         }
#     ])
#     printer.pprint(list(result))


# fuzzy_matching()


def autocomplete():
    result = food_collection.aggregate([
        {
            "$search": {
                "index": "food_search",
                "autocomplete": {
                    "query": "ground",
                    "path": "name",
                    "tokenOrder": "sequential",
                    "fuzzy": {}
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "name": 1
            }
        }
    ])
    printer.pprint(list(result))


autocomplete()


""" 
Form input field. As user types. onChange, need to call the backend to run Atlas search and shoot back updated list of suggestions to render.
 """


@foods.route("/autocomplete", methods=["GET"])
def autocomplete_foods(query):
    try:
        result = food_collection.aggregate([
            {
                "$search": {
                    "index": "food_search",
                    "autocomplete": {
            # template literal
                        "query": query,
                        "path": "name",
                        "tokenOrder": "sequential",
                        "fuzzy": {}
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "name": 1
                }
            }
        ])
        printer.pprint(list(result))
        if result:
            return result, 200
        else: 
            return "No food with this name found", 404
    except Exception as e:
        return {
            "message": str(e),
            "error": "Error fetching food",
            "data": None,
        }, 500
