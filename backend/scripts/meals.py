
from random import randint
import pymongo
import datetime
import sys
from bson import ObjectId
sys.path.insert(0,"..")
from db import db, test_db


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
    # ex. [8, 9, 12, 14, ...]
    main_groups = [randint(0, len(groups) - num_g)]
    for i in range(1, num_g):
        main_groups.append(randint(main_groups[i - 1] + 1, len(groups) - num_g + i))

    # choose top foods for each of the groups
    #[[food, food, ...], [food, food, ...], ...]
    main_food_names = []
    for idx in main_groups:
        foods = [] 
        group_foods = groups[idx]['foods']
        for i in range(2):
            foods.append(group_foods[randint(0, len(group_foods) - 1)])

        main_food_names.append(foods)

    print(username, main_food_names)


    # choose 3 main symptoms, store the indexes
    # [1, 7, 9, 12, ..]
    main_symptoms = [randint(0, len(symptoms) - num_s)]
    for i in range(1, num_s):
        main_symptoms.append(randint(main_symptoms[i - 1] + 1, len(symptoms) - num_s + i))

    all_symptoms = []
    all_meals = []

    # go through all the days
    for d in range(max_days):
        if(randint(0, 100) < consistency): continue

        symptom_prob = 0  # probability of a symptom
        hour = randint(5, 8)  # hour of first meal
        num_meals = randint(2, max_meals)  # num of meals that day
        
        for m in range(num_meals):
            meal_foods = []
            meal_groups = []

            # include 1-6 foods
            for f in range(randint(1, 5)):
                # added probability that it's a food from the main group
                groupIdx = None
                foodIdx = None

                if(randint(1, 100) <= food_flex):
                    groupIdx = main_groups[0]
                    foodIdx = 0
                elif(randint(1, 100) <= int(food_flex/3)):
                    foodIdx = randint(1, len(main_groups) - 1)
                    groupIdx = main_groups[foodIdx]
                else:
                    foodIdx = None
                    groupIdx = randint(0, len(groups) - 1)
                    
                # increase probability of symptom
                if(groupIdx == main_groups[0]):
                    symptom_prob += 2
                elif(groupIdx in main_groups):
                    symptom_prob += 1
                
                chosen_group = groups[groupIdx]['group']
                
                possible_foods = None
                if(randint(0, 100) < 85 and foodIdx): 
                    possible_foods = main_food_names[foodIdx]
                else: 
                    possible_foods = groups[groupIdx]['foods']
                
                chosen_food = possible_foods[randint(0, len(possible_foods) - 1)]

                if chosen_food not in meal_foods:
                    meal_foods.append(chosen_food)
                
                if chosen_group not in meal_groups:
                    meal_groups.append(chosen_group)
            
            all_meals.append(create_meal(meal_foods, meal_groups, hour, d, username))

            hour = hour + randint(1, 3)
            if hour > 23: hour = 23

        # symptom_prob /= (num_meals + 1)/2

        # probability of the symptom occuring
        if(randint(0, 10) <= symptom_prob):

            all_symptoms.append(create_user_symptom(main_symptoms[0], int(symptom_prob), hour + randint(-3, 3), d + 1, username, symptoms))
            
            if(randint(0, 100) <= int(symptom_thresh/2)):
                all_symptoms.append(create_user_symptom(main_symptoms[randint(1, len(main_symptoms) - 1)], int(symptom_prob), hour + randint(-3, 3), d + 1, username, symptoms))
        

    # insert all the meals the meals
    # all_created_meals = db.foods.insert_many(day_meals)
    # and loop through the symptoms, adding meals

    # convert to dictionary
    if(len(all_meals) < 20 or len(all_symptoms) < 20):
        print('not enough symptoms or meals')

    print(f'Seeding {len(all_meals)} meals and {len(all_symptoms)} symptoms for {max_days} days!')

    all_symptoms.sort(key=lambda s: s['datetime'])
    db.user_symptoms.insert_many(all_symptoms)
    user_symptoms = [s for s in db.user_symptoms.find({"username": username})]

    all_meals.sort(key=lambda m: m['datetime'])
    pointer = 0

    for m in all_meals:
        i = pointer
        time = m['datetime']

        # if the first symptom is already too far out, skip
        if(check_hour_dif(user_symptoms[i]['datetime'], time) > 30): continue

        # if the first symptom is before the current meal, go til finding a symptom with a time dif greater than 0
        while(i < len(user_symptoms) and check_hour_dif(user_symptoms[i]['datetime'], time) < 0):
            i += 1
        
        pointer = i

        # stop if you've reached the end
        if(pointer >= len(user_symptoms)): break

        # add any symptoms within the range
        while(i < len(user_symptoms) and 0 <= check_hour_dif(user_symptoms[i]['datetime'], time) <= 30): 
            m['related_symptoms'].append(user_symptoms[i]['_id'])
            i += 1

    db.meals.insert_many(all_meals)

    corrs = create_correlations(main_symptoms, main_groups, symptoms, groups, username)
    db.correlations.insert_many(corrs)




def create_user_symptom(idx, prob, hour, day, username, symptoms):
    hour = hour % 23
    date = get_date(day, hour)
    severity = randint(prob - 3, prob + 2)
    if(severity > 10): severity = 10
    if(severity < 1): severity = 1

    return {'username': username, 'symptom': symptoms[idx]['name'], 'datetime': date, 'severity': severity}


def create_meal(foods, groups, hour, day, username):
    date = get_date(day, hour % 23)

    return {'username': username, 'datetime': date, 'groups': groups, 'foods': foods, 'related_symptoms': []}


def get_date(day, hour):
    return datetime.datetime(2022, 1, 1, hour, 0) + datetime.timedelta(day)


def check_hour_dif(a, b):
    diff = a - b
    return diff.total_seconds()/3600

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

    if(input('Delete test data? y or n  ') == 'y'):
        test_db.meals.delete_many({})
        test_db.user_symptoms.delete_many({})

    

    path = input('Random? y or n ')
    users = [u for u in db.users.find()]
    if(path == 'n'):
        u = input('Specific user? y or n ')
        if(u == 'y'):
            username = input('username?')
            db.user_symptoms.delete_many({"username": username})
            db.meals.delete_many({"username": username})

            answers = [
                username,
                int(input('number of months?  ')) * 30,
                int(input('number of symptoms?  ')),
                int(input('number of food groups?  ')),
                int(input('max meals in a day?  ')),
                int(input('food inflexibility? 1-100  ')),
                int(input('symptom threshold? 1-100  ')),
                int(input('consistency? 1-100  ')),
            ]

            create_user_data(*answers)
        
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
                randint(80, 800),
                randint(2,5),
                randint(2,5),
                randint(2, 6),
                randint(5, 60),
                randint(10, 80),
                randint(0, 68))

    print('success!')

if __name__ == '__main__':
    # db.users.create_index([('username', pymongo.ASCENDING)], unique=True)
    run_seed()
    