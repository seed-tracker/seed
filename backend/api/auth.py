from flask import Flask
from app import app

@app.route('/api/auth')
def signup():
  return "Signup"
