
# Module to configure db client
import bson
import os
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

# function to get and return the database, usable throughout the backend
def get_db():
#     # create a connection with the client using MONGO_URI from .env folder
    client = MongoClient(os.environ.get('MONGO_URI'))
    return client

# to get db instance globally
# from db import get_db
client = get_db()
db = client.production
