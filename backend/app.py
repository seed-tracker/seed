# main entry point for backend
# app combines all routes, implements CORS and runs server
from flask_cors import CORS
from flask import Flask
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
import os
from flask_pymongo import PyMongo

from api.userroutes import users
from api.foodgroups import groups
from api.foods import foods
from api.symptoms import symptoms
from api.user_symptoms import user_symptoms
from api.auth import auth
from api.meals import meals
from api.stats import stats

app = Flask(__name__, static_folder="../frontend/build", static_url_path="")

cors = CORS(app)

app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(groups, url_prefix="/groups")
app.register_blueprint(foods, url_prefix="/foods")
app.register_blueprint(symptoms, url_prefix="/symptoms")
app.register_blueprint(meals, url_prefix="/meals")
app.register_blueprint(user_symptoms, url_prefix="/user/symptoms")
app.register_blueprint(users, url_prefix="/users")
app.register_blueprint(stats, url_prefix="/stats")


app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")


@app.route("/")
def index():
    return "Hello World", 200


@app.errorhandler(404)
def not_found(e):
    return "Not found", 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT", 80))
