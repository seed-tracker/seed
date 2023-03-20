from flask_cors import CORS
from flask import Flask
import pprint
import os

from dotenv import load_dotenv, find_dotenv
import os
load_dotenv(find_dotenv())

app = Flask(__name__)
from api.auth import *
from api.symptoms import *
from api.foodroutes import *
from api.foodgroups import *
# from api.home import *
from api.userroutes import *

from api.auth import *
from api.symptoms import *
cors = CORS(app)
# to protect the app
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

cors = CORS(app)

if __name__ == "__main__":
    app.run()
