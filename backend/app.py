from flask import Flask
from api.auth import *
from dotenv import load_dotenv, find_dotenv
import os
load_dotenv(find_dotenv())
# from routes import routes_bp
from flask_cors import CORS
cors = CORS(app)

app = Flask(__name__)

# to protect the app
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")



if __name__ == "__main__":
  app.run()
