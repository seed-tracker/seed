from flask import Flask
app = Flask(__name__)
from routes import routes_bp
from flask_cors import CORS
cors = CORS(app)

app.register_blueprint(routes_bp)

if __name__ == "__main__":
  app.run()
