'''
File to create meals and attach them to users

Basic approach:
1. choose a user
2. choose a main food group and two secondary food groups
3. choose a main symptom and two secondary symptoms

User Group #1
Great data:
    Seed 9 months worth of data
    2-5 meals per day
    0-2 symptoms per day
    Correlate the main food group to the main symptom, and the second, third groups to correlate more weakly
    For each meal:
        Add 1-4 foods
        About 25% probability of the main food group being included
        About 10% probability of the secondary ones
    
    For each symptom:
        If the main food was eaten that day, 75% probability of symptom occuring within the next day and being severe
        If the main or secondary foods were eaten, 40% probability of secondary symptoms occuring in the next 30 hours, 40% chance of mild main symptom

User Group #2
Good data:
    Choose 4 main food groups, 2 main symptoms
    Seed 7 months of data
    0-4 meals per day
    0-2 symptoms per day
    10% chance of no meals logged
    10% chance of no symptoms logged
    Correlate main symptom about evenly to three food groups
    For each meal:
        1-4 foods
        About 25% probability of each main food group being eaten
        For each of the main groups added, probability of symptoms increases by 10% and become more severe within next 30 hours
        Completely random chance of another symptom

User Group #3
Random data:
    Seed 9 months of data
    0-3 meals per day
    0-2 symptoms per day
    10-30% chance of no meals
    10-30% chance of no symptoms
    For each meal:
        1-5 foods
        Random probability of any food
        Random probability and severity of any food

User Group #5
Bad data:
    Seed 9 months of data
    Choose 2 main symptoms and 3 main food groups
    0-3 meals per day
    0-2 symptoms per day
    50% chance of no meals
    50% chance of no symptoms
    For each meal:
        1-5 foods, 10% chance from main groups
        Random chance of two main symptoms in next 30 hours
        

User Group #6
Unchanging data:
    Seed 9 months data
    Choose 2 main symptoms and 2 main food groups
    For each meal:
        1-5 foods
        75% chance of those being from the two main groups
        With those groups, 10% increasing chance of symptoms and increasing severity     
    
'''
from random import randint
import datetime
import sys
sys.path.insert(0,"..")
from db import db

def fetch_data():
    print('fetching...')
 
    pipeline = [
        {
            "$unwind": "$group_id"
        },
        {
            "$group": {
                "_id": "$group_id",
                "foods": {"$push": {"id": "$_id", "name": "$name"}}
            }
        },{
        "$lookup": {
            "from": "groups",
            "localField": "_id",
            "foreignField": "_id",
            "as": "group"
        }}
    ]

    result = db.foods.aggregate(pipeline)

    # get all the symptoms
    symptoms = db.symptoms.find()

    

    # return them
    return [groups, symptoms]

fetch_data()

# def create_great_data():
#     groups, symptoms = fetch_data()
#     # choose 3 food groups
#     main_groups = [groups[randint(0, len(groups) - 3)]]
#     for i in range(2):
#         main_groups.append(randint(main_groups[i - 1], len(groups) - 2 + i))

#     main_symptoms = [symptoms[randint(0, len(symptoms) - 3)]]
#     for i in range(2):
#         main_symptoms.append(randint(main_symptoms[i - 1], len(symptoms) - 2 + i))

#     max_days = 31 * 9

#     # go through all the days
#     for d in range(max_days):

#         symptom_prob = 2
#         hour = 5
#         num_meals = randint(1, 5)
#         # put 1 - 5 meals per day
#         for m in range(num_meals):
#             foods = []
#             # include 1-4 foods
#             for f in range(randint(1, 6)):
                

                
    

    




# def meal(days, hours, groups, foods, user_id):
#     jan_1 = datetime.datetime(2022, 1, 1, hours, 0)
#     target_dt = jan_1 + datetime.timedelta(days)

#     return {
#         "datetime": target_dt,
#         "groups": groups,
#         "foods": foods,
#         "user_id": user_id
#     }

# def user_symptom(name, user_id, symptom_id, datetime, meals)
#     return