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

app = Flask(__name__)

cors = CORS(app)

app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(groups, url_prefix="/groups")
app.register_blueprint(foods, url_prefix="/foods")
app.register_blueprint(symptoms, url_prefix="/symptoms")
app.register_blueprint(meals, url_prefix="/meals")
app.register_blueprint(user_symptoms, url_prefix="/user/symptoms")
app.register_blueprint(users, url_prefix="/users")




# to protect the app
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
