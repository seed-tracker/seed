# main entry point for backend
# app combines all routes, implements CORS and runs server
from flask_cors import CORS
from flask import Flask, Blueprint
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

from config import load_config

app = Flask(__name__, static_url_path="")
cors = CORS(app)

app.config.from_object(load_config())


main = Blueprint("main", __name__, url_prefix="/api")


main.register_blueprint(auth, url_prefix="/auth")
main.register_blueprint(groups, url_prefix="/groups")
main.register_blueprint(foods, url_prefix="/foods")
main.register_blueprint(symptoms, url_prefix="/symptoms")
main.register_blueprint(meals, url_prefix="/meals")
main.register_blueprint(user_symptoms, url_prefix="/user/symptoms")
main.register_blueprint(users, url_prefix="/users")
main.register_blueprint(stats, url_prefix="/stats")

app.register_blueprint(main)


# to protect the app
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")


if os.environ.get("MODE") == "production":

    @app.route("/")
    def send_frontend():
        return app.send_static_file("index.html")

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run()
