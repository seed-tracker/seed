from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
import os

from flask import Flask

app = Flask(__name__)

# to protect the app
app.config["SECRET_KEY"] = os.environ.get('SECRET_KEY')

from routes import routes_bp
from flask_cors import CORS
cors = CORS(app)

app.register_blueprint(routes_bp)

if __name__ == "__main__":
  app.run()
