from flask import Flask, Blueprint

app = Flask(__name__)

routes_bp = Blueprint('routes', __name__)

@routes_bp.route("/symptoms/")
def symptoms():
    return "Symptoms"