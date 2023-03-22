from db import db
import pprint
from pprint import PrettyPrinter
from pymongo import MongoClient

food_collection = db.foods

food_collection.aggregate([{}])