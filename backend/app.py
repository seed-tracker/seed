from flask_cors import CORS
from flask import Flask
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
import os
import pprint

from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
from api.userroutes import *
from api.foodgroups import *
from api.foodroutes import *
from api.symptoms import *
from api.auth import *

from api.auth import *
from api.symptoms import *
from api.userroutes import *
from api.foodgroups import *
from api.foodroutes import *
from api.foodgroups import *
# from api.home import *
from api.userroutes import *

cors = CORS(app)

# to protect the app
app.config["SECRET_KEY"] = os.environ.get('SECRET_KEY')

if __name__ == "__main__":
    app.run(port=5000, debug=True)
