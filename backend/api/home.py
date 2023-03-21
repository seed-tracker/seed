from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'the whole world in a mustard seed'

if __name__ == '__main__':
    app.run()