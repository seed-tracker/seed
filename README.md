# Seed Tracker

## set up virtualenv

pip install virtualenv || pip3 install virtualenv
python3 -m venv seed

## to run backend

pip install -r requirements.txt

### Windows:

.\seed\Scripts\activate (activates virtual env)
cd into seed-backend
python app.py (starts the server)
deactivate (deactivates virtual env)

### Mac/Linux:

source seed/bin/activate (activates virtual env)
cd into seed-backend
python3 app.py (starts the server)
deactivate (deactivates virtual env)

## to run frontend

cd to seed-frontend
npm install
npm start to start your frontend
