from faker import Faker
fake = Faker()

import datetime

import sys
sys.path.insert(0,"..")
from db import db

def create_users(n):
    user_list = []
    for _ in range(n):
        user = create_user(fake.name(), fake.user_name(), fake.password(), fake.email(), datetime.datetime(1980, 10, 20))
        user_list.append(user)
    
    return user_list

def create_user(name, username, password, email, birthdate):
    return {"name": name, "username": username, "password": password, "email": email, "birthdate": birthdate}

if __name__ == "__main__":
    n = input('How many users?')
    db.users.insert_many(create_users(int(n)))
    print(f'Seeded {n} users')