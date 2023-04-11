from faker import Faker
fake = Faker()

import bcrypt
import jwt
import os
salt = bcrypt.gensalt(5)
secret = os.environ.get('JWT_SECRET')

import datetime

import sys
sys.path.insert(0,"..")
from db import db, test_db

def create_users(n):
    """ Seed the database with users

    n = number of users to seed
    name = first and last name of user
    username = username of user
    password = hashed password
    email = user's email
    birthdate = date of birth for user
    """
    user_list = []

    for _ in range(n):
        username = fake.user_name()
        password = f"{username}_pass"

        # make sure the name isn't taken
        if(username in [u['username'] for u in user_list]): continue

        user = create_user(fake.name(), username, password, fake.email(), datetime.datetime(1980, 10, 20))
        user_list.append(user)

    return user_list

def create_user(name, username, password, email, birthdate):
    hashed_pass = bcrypt.hashpw(password.encode('utf-8'), salt)

    return {"name": name, "username": username, "password": hashed_pass.decode('utf-8'), "email": email, "birthdate": birthdate}

if __name__ == "__main__":
    # db.users.delete_many({})
    # db.meals.delete_many({})
    # db.user_symptoms.delete_many({})
    n = input('How many users?')
    db.users.insert_many(create_users(int(n)))
    print(f'Seeded {n} users')
