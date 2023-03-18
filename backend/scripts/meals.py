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
            "$unwind": "$groups"
        },
        {
            "$group": {
                "_id": "$groups",
                "foods": {"$push": "$name"}
            }
        },
        {
            "$project": {
                "group": "$_id",
                "foods": 1,
                "_id": 0
            }
        }
    ]

    groups = db.foods.aggregate(pipeline)

    # get all the symptoms
    symptoms = db.symptoms.find()

    # return them
    return [groups, symptoms]


def create_user_data(username, days, num_s, num_g, max_meals, food_flex, symptom_thresh, consistency):
    [groups_cursor, symptoms_cursor] = fetch_data()
    groups = [g for g in groups_cursor]
    symptoms = [s for s in symptoms_cursor]

    generate_data(username, groups, symptoms, days, num_s, num_g, max_meals, food_flex, symptom_thresh, consistency)



def generate_data(username, groups, symptoms, max_days, num_s, num_g, max_meals, food_flex, symptom_thresh, consistency):

    # choose 3 food groups, store the indexes
    main_groups = [randint(0, len(groups) - num_g)]
    for i in range(1, num_g):
        main_groups.append(randint(main_groups[i - 1], len(groups) - num_g + i))

    # choose 3 main symptoms, store the indexes
    main_symptoms = [randint(0, len(symptoms) - num_s)]
    for i in range(1, num_s):
        main_symptoms.append(randint(main_symptoms[i - 1], len(symptoms) - num_s + i))

    all_symptoms = []
    all_meals = []

    # go through all the days
    for d in range(max_days):
        if(randint(0, 100) < consistency): continue

        symptom_prob = 1  # probability of a symptom
        hour = randint(5, 8)  # hour of first meal
        num_meals = randint(2, max_meals)  # num of meals that day
        
        for m in range(num_meals):
            meal_foods = []
            meal_groups = []

            # include 1-6 foods
            for f in range(randint(1, 5)):
                # added probability that it's a food from the main group
                groupIdx = None

                if(randint(1, 100) <= food_flex):
                    groupIdx = main_groups[0]
                elif(randint(1, 100) <= int(food_flex/3)):
                    groupIdx = main_groups[randint(1, len(main_groups) - 1)]
                else:
                    groupIdx = randint(0, len(groups) - 1)
                    
                # increase probability of symptom
                if(groupIdx == main_groups[0]):
                    symptom_prob += 1
                elif(groupIdx in main_groups):
                    symptom_prob += 0.5
                
                chosen_group = groups[groupIdx]['group']
                possible_foods = groups[groupIdx]['foods']

                chosen_food = possible_foods[randint(0, len(possible_foods) - 1)]

                if chosen_food not in meal_foods:
                    meal_foods.append(chosen_food)
                
                if chosen_group not in meal_groups:
                    meal_groups.append(chosen_group)
            
            all_meals.append(create_meal(meal_foods, meal_groups, hour, d, username))

            hour = hour + randint(1, 3)
            if hour > 23: hour = 23

        symptom_prob /= (num_meals + 1)/5

        # probability of the symptom occuring
        if(randint(0, 10) <= symptom_prob):

            if(randint(0, 100) <= symptom_thresh):
                all_symptoms.append(create_user_symptom(main_symptoms[0], int(symptom_prob), hour + randint(-3, 3), d + 1, username, symptoms))
            
            if(randint(0, 100) <= int(symptom_thresh/2)):
                all_symptoms.append(create_user_symptom(main_symptoms[randint(1, len(main_symptoms) - 1)], int(symptom_prob), hour + randint(-3, 3), d + 1, username, symptoms))
        

    # insert all the meals the meals
    # all_created_meals = db.foods.insert_many(day_meals)
    # and loop through the symptoms, adding meals

    # convert to dictionary
    if(len(all_meals) < 20 or len(all_symptoms) < 20):
        print('not enough symptoms or meals')

    print(f'Seeding {len(all_meals)} meals and {len(all_symptoms)} symptoms')

    meals_cursor = db.meals.insert_many(all_meals)
    meals = [m for m in db.meals.find()]
    all_symptoms.sort(key=lambda s: s['datetime'])
    
    
    # when the first meal comes up for that given symptom, set that to the starting pointer
    # starting from the pointer, find the first point when 
    # go through until reaching a point where the time diff is too large
    pointer = 0

    for s in all_symptoms:
        i = pointer
        time = s['datetime']

        while(i < len(meals) and not check_hour_dif(time, meals[i]['datetime'])):
            i += 1
        
        pointer = i

        while(i < len(meals)):
            if(check_hour_dif(time, meals[i]['datetime'])):
                s['meals'].append(meals[i]['_id'])
                i += 1
            else: break

    db.user_symptoms.insert_many(all_symptoms)

    corrs = create_correlations(main_symptoms, main_groups, symptoms, groups, username)
    db.correlations.insert_many(corrs)




def create_user_symptom(idx, prob, hour, day, username, symptoms):
    hour = hour % 23
    date = get_date(day, hour)
    severity = randint(prob - 2, prob + 2)
    if severity > 10 or severity < 1: severity = prob

    return {'username': username, 'symptom': symptoms[idx]['name'], 'datetime': date, 'meals': [], 'severity': severity}


def create_meal(foods, groups, hour, day, username):
    date = get_date(day, hour % 23)

    return {'username': username, 'datetime': date, 'groups': groups, 'foods': foods}


def get_date(day, hour):
    return datetime.datetime(2022, 1, 1, hour, 0) + datetime.timedelta(day)


def check_hour_dif(a, b):
    diff = a - b
    if 0 <= diff.total_seconds()/3600 <= 30:
        return True

    return False

def create_stats(item):
    lift = randint(2,3)/2
    avg_severity = randint(6,14)/2
    return {
        'name': item,
        'lift': lift,
        'avg_severity': avg_severity,
        'score': lift * avg_severity/10,
        'avg_hours_passed': randint(0, 29)
    }

def create_correlations(main_symptoms, main_groups, symptoms, groups, username):
    all_corrs = []

    top_foods = []
    top_groups = []

    for i in main_groups:
        if(not groups[i]['group'] in top_groups):
            top_groups.append(groups[i]['group'])

        rand_food = groups[i]['foods'][randint(0, len(groups[i]['foods']) - 1)]
        if(not rand_food in top_foods):
            top_foods.append(rand_food)
    
    for s in main_symptoms:
        all_corrs.append({
            'symptom': symptoms[s]['name'],
            'username': username,
            'top_groups': [create_stats(g) for g in top_groups],
            'top_foods': [create_stats(f) for f in top_foods]
        })

    return all_corrs


def run_seed():
    start = input('Delete prev REAL data? y or n ')
    if(start == 'y'): 
        if(input('Are you sure? y or n  ') == 'y'):
            db.meals.delete_many({})
            db.user_symptoms.delete_many({})
            db.correlations.delete_many({})

        if(input('stop? y or n ') == 'y'): 
            return

    

    path = input('Random? y or n ')
    users = [u for u in db.users.find()]
    if(path == 'n'):
        u = input('Specific user? y or n ')
        if(u == 'y'):
            answers = [
                input('username?'),
                int(input('number of months?  ')) * 30,
                int(input('number of symptoms?  ')),
                int(input('number of food groups?  ')),
                int(input('max meals in a day?  ')),
                int(input('food inflexibility? 1-100  ')),
                int(input('symptom threshold? 1-100  ')),
                int(input('consistency? 1-100  ')),
            ]
            create_user_data(**answers)
        
        else:
            num = int('number of users? ')
            
            for i in range(num):
                username = users[i]['username']
                answers = [
                    int(input('number of months?  ')) * 30,
                    int(input('number of symptoms?  ')),
                    int(input('number of food groups?  ')),
                    int(input('max meals in a day?  ')),
                    int(input('food inflexibility? 1-100  ')),
                    int(input('symptom threshold? 1-100  ')),
                    int(input('consistency? 1-100  ')),
                ]
                create_user_data(username, **answers)

    else:
        num = input('number of users? all or number ')

        if(num == 'all'):
            num = len(users)
        
        num = int(num)
        
        for i in range(num):
            create_user_data(
                users[i]['username'],
                randint(60, 450),
                randint(2,5),
                randint(2,10),
                randint(2, 6),
                randint(5, 60),
                randint(18, 70),
                randint(0, 40))

    print('success!')

if __name__ == '__main__':
    run_seed()
    