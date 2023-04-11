# Seed Tracker

Full stack web app to track your food input and well-being. <br>
Allows users to track symptoms and food intake to get insights that might help identify patterns, and narrow down food-based triggers. <br>
Insights are associations/relations and are NOT medical advice.

## Features

- User Login, Account Creations and Authentication throughout the app
- Users can edit their profile and view associations/relationships in graphs on their profile
- Users are able to track meals and symptoms
  - Meal form includes an autocomplete component
- Users are able to view a history of past symptoms and meals and can delete past entries

## Technologies Used

- React
- Redux
- React Router
- D3
- Flask
- Node
- Python
- MongoDB
- Pymongo
- JWT
- bcrypt
- Axios
- Webpack
- NEXT UI
- UUID
- CSS
- HTML

## Collaborators

Judy Kuo: [Github](https://github.com/judazzle) | [LinkedIn](https://www.linkedin.com/in/judylkuo/) <br>
Jo Lee: [Github](https://github.com/holycaca0) | [LinkedIn](https://www.linkedin.com/in/jo-lee-710a50125/) <br>
Wanyi Ng: [Github](https://github.com/wanyi-ng) | [LinkedIn](https://www.linkedin.com/in/wanyi-ng/) <br>
Leah Treidler: [Github](https://github.com/ltreidler) | [LinkedIn](https://www.linkedin.com/in/ltreidler/) <br>
Vik Wedel: [Github](https://github.com/orgs/graceshpopper-team-backend-protokol/people/vik-wed) | [LinkedIn](https://www.linkedin.com/in/vikwedel/)

## Run it on your local machine

### set up and run virtualenv

Windows:

1. pip install virtualenv
2. python -m venv seed
3. .\seed\Scripts\activate
4. pip install -r requirements.txt
5. deactivate (deactivates virtual env)

Mac/Linux:

1. pip3 install virtualenv
2. python3 -m venv seed
3. source seed/bin/activate
4. pip3 install -r requirements.txt
5. deactivate (deactivates virtual env)

### to run the backend server

1. cd into backend
2. python app.py || python3 app.py (starts the server)

### to run the frontend react-app

1. cd into seed-frontend
2. npm install
3. npm start to start your frontend
