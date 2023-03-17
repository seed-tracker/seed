from flask import Flask
from app import app

@app.route("/symptoms")
def symptoms():
    return "Symptoms"