
# Module to configure db client
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
from pymongo import MongoClient
import os
import bson

# function to get and return the database, usable throughout the backend
def get_db():
    # create a connection with the client using MONGO_URI from .env folder
    client = MongoClient(os.environ.get('MONGO_URI'))
    return client.production

# to get db instance globally
# from db import get_db
db = get_db()
