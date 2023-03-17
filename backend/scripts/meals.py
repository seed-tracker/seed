'''
File to create meals and attach them to users

Basic approach:
1. choose a user
2. choose a main food group and two secondary food groups
3. choose a main symptom and two secondary symptoms

User Group #1
Great data:
    Seed 10ish months worth of data
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
from bson import ObjectId
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

    # groups = db.foods.aggregate(pipeline)
    groups = [{'id': ObjectId('64137d120b63ba8c0db0d685'), 'foods': [{'id': ObjectId('641397d8fa6b4079054f3c2c'), 'name': 'Daiquiri'}, {'id': ObjectId('641397d8fa6b4079054f3c31'), 'name': 'Energy Drink'}, {'id': ObjectId('641397d8fa6b4079054f3c32'), 'name': 'Cola'}, {'id': ObjectId('641397d8fa6b4079054f3c33'), 'name': 'Donut'}, {'id': ObjectId('641397d8fa6b4079054f3c34'), 'name': 'Cereal, Sugary'}, {'id': ObjectId('641397d8fa6b4079054f3c35'), 'name': 'Cookie, Chocolate Chip'}, {'id': ObjectId('641397d8fa6b4079054f3c36'), 'name': 'Candy Bar'}, {'id': ObjectId('641397d8fa6b4079054f3c37'), 'name': 'Cupcake'}, {'id': ObjectId('641397d8fa6b4079054f3c48'), 'name': 'Vanilla Ice Cream'}, {'id': ObjectId('641397d8fa6b4079054f3c73'), 'name': 'Doughnuts'}], 'group': [{'id': ObjectId('64137d120b63ba8c0db0d685'), 'name': 'Refined Sugars', 'description': ' any foods with added sugar such as: chocolate, ice cream, cookies, cocktails, soda, non-fresh juice, canned fruits or fruits w/ added juice, dressings & spreads'}]}, {'id': ObjectId('64137d120b63ba8c0db0d682'), 'foods': [{'id': ObjectId('641397d8fa6b4079054f3c3d'), 'name': 'Walnut'}, {'id': ObjectId('641397d8fa6b4079054f3c3e'), 'name': 'Almond'}, {'id': ObjectId('641397d8fa6b4079054f3c3f'), 'name': 'Pistachio'}, {'id': ObjectId('641397d8fa6b4079054f3c40'), 'name': 'Peanut'}, {'id': ObjectId('641397d8fa6b4079054f3c41'), 'name': 'Cashew'}], 'group': [{'id': ObjectId('64137d120b63ba8c0db0d682'), 'name': 'Nuts and Seeds', 'description': 'tree nuts, nut butters, peanuts'}]}, {'id': ObjectId('64137d120b63ba8c0db0d687'), 'foods': [{'id': ObjectId('641397d8fa6b4079054f3c2e'), 'name': 'Coffee, Black'}, {'id': ObjectId('641397d8fa6b4079054f3c2f'), 'name': 'Tea, Black'}, {'id': ObjectId('641397d8fa6b4079054f3c30'), 'name': 'Yerba Mate'}, {'id': ObjectId('641397d8fa6b4079054f3c31'), 'name': 'Energy Drink'}, {'id': ObjectId('641397d8fa6b4079054f3c32'), 'name': 'Cola'}], 'group': [{'id': ObjectId('64137d120b63ba8c0db0d687'), 'name': 'Caffeinated Beverages', 'description': 'coffee, tea, energy drinks'}]}]

    # get all the symptoms
    # symptoms = db.symptoms.find()

    symptoms = [{'id': 'lkd2dj', 'name': 'stomache ache'},{'id': 'lkfdsfdj', 'name': 'headache'},{'id': 'flkdj', 'name': 'nauseu'},{'id': 'fdslj;fd', 'name': 'vomiting'},{'id': 'fdjslds', 'name': 'fatigue'}]

    # return them
    return [groups, symptoms]


def create_user_data():
    [groups, symptoms] = fetch_data()
    generate_data('user_id', groups, symptoms)


def generate_data(user_id, groups, symptoms):

    # choose 3 food groups, store the indexes
    main_groups = [randint(0, len(groups) - 3)]
    for i in range(2):
        main_groups.append(randint(main_groups[i - 1], len(groups) - 2 + i))

    # choose 3 main symptoms, store the indexes
    main_symptoms = [randint(0, len(symptoms) - 3)]
    for i in range(2):
        main_symptoms.append(randint(main_symptoms[i - 1], len(symptoms) - 2 + i))

    max_days = 5

    all_symptoms = []
    all_meals = []

    # go through all the days
    for d in range(max_days):

        symptom_prob = 1  # probability of a symptom
        hour = randint(5, 8)  # hour of first meal
        num_meals = randint(1, 5)  # num of meals that day
        
        for m in range(num_meals):
            meal_foods = []
            meal_groups = []

            # include 1-6 foods
            for f in range(randint(1, 6)):
                # added probability that it's a food from the main group
                current_group = None
                if(randint(1, 100) <= 10):
                    current_group = main_groups[0]
                elif(randint(1, 100) <= 5):
                    current_group = main_groups[randint(1,2)]
                else:
                    current_group = randint(0, len(groups) - 1)
                    
                # increase probability of symptom
                if(current_group == main_groups[0]):
                    symptom_prob += 1
                elif(current_group in main_groups):
                    symptom_prob += 0.5
                
                possible_foods = groups[current_group]['foods']
                group_id = groups[current_group]['id']
                chosen_food_id = possible_foods[randint(0, len(possible_foods) - 1)]['id']

                if chosen_food_id not in meal_foods:
                    meal_foods.append(chosen_food_id)
                
                if group_id not in meal_groups:
                    meal_groups.append(groups[current_group]['id'])
            
            all_meals.append(create_meal(meal_foods, meal_groups, hour, d))

            hour += 2
        
        if(randint(0, 10) <= symptom_prob):
            if(randint(0, 10) <= 6):
                all_symptoms.append(create_user_symptom(main_symptoms[0], symptom_prob, hour + randint(-3, 3), d + 1, user_id, symptoms))
            
            if(randint(0, 10) <= 3):
                all_symptoms.append(create_user_symptom(main_symptoms[randint(1, 2)], symptom_prob, hour + randint(0, 3), d + 1, user_id, symptoms))

    # insert all the meals the meals
    # all_created_meals = db.foods.insert_many(day_meals)
    # and loop through the symptoms, adding meals

    # print(all_meals)
    # print(all_symptoms)


def create_user_symptom(idx, prob, hour, day, user_id, symptoms):
    hour = hour % 23
    date = get_date(day, hour)

    return {'name': symptoms[idx]['name'], 'user_id': user_id, 'symptom_id': symptoms[idx]['id'], 'datetime': date, 'meals': [], 'severity': prob}

# datetime, groups, foods
def create_meal(foods, groups, hour, day):
    date = get_date(day, hour % 23)
    print(date)
    return {'datetime': date, 'groups': groups, 'foods': foods}


def get_date(day, hour):
    return datetime.datetime(2022, 1, 1, hour, 0) + datetime.timedelta(day)

        
create_user_data()