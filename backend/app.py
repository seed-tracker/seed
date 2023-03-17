from flask import Flask
from dotenv import load_dotenv, find_dotenv
import os
load_dotenv(find_dotenv())
# from routes import routes_bp
from flask_cors import CORS
app = Flask(__name__)

from api.auth import *
from api.symptoms import *
cors = CORS(app)
# to protect the app
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")



if __name__ == "__main__":
  app.run()
