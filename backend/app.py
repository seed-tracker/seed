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

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(groups, url_prefix="/api/groups")
app.register_blueprint(foods, url_prefix="/api/foods")
app.register_blueprint(symptoms, url_prefix="/api/symptoms")
app.register_blueprint(meals, url_prefix="/api/meals")
app.register_blueprint(user_symptoms, url_prefix="/api/user/symptoms")
app.register_blueprint(users, url_prefix="/api/users")
app.register_blueprint(stats, url_prefix="/api/stats")


app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT", 80))
