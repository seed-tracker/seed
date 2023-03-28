# File to add meals
from random import randint
import pymongo
import datetime
import sys
from bson import ObjectId
sys.path.insert(0,"..")
from db import db, test_db


def fetch_data():
    print('fetching...')

    # get foods with associated groups
    # [{group: groupName, foods: [food1, food2, etc.]}]
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

    # return them for use in generate_data
    return [groups, symptoms]


def create_user_data(username, days, num_symptoms, num_groups, max_meals, food_flex, symptom_thresh, consistency):
    """ Seed the database with meals and symptoms for any or all users by running generate_data

    days = number of days to seed
    num_symptoms = # of symptoms to include
    num_groups = # of main groups and trigger groups
    max_meals = max meals user records in a day
    food_flex = 1-100, how flexible user is about their food (aka how much they eat from their main groups vs all other groups)
    symptom_thresh = 1-100, probability of a symptom,
    consistency = 1-100, how often user skips days of recording
    """


    [groups_cursor, symptoms_cursor] = fetch_data()

    # create lists from the groups and symptoms
    groups = [g for g in groups_cursor]
    symptoms = [s for s in symptoms_cursor]

    generate_data(username, groups, symptoms, days, num_symptoms, num_groups, max_meals, food_flex, symptom_thresh, consistency)



def generate_data(username, groups, symptoms, max_days, num_s, num_g, max_meals, food_flex, symptom_thresh, consistency):

    # choose 3 food groups, store the indexes
    # ex. [8, 9, 12, 14, ...]
    # these will be the groups the user is most likely to eat
    main_groups = [randint(0, len(groups) - num_g)]
    for i in range(1, num_g):
        main_groups.append(randint(main_groups[i - 1] + 1, len(groups) - num_g + i))

    # choose top foods for each of the groups
    #[[food, food, ...], [food, food, ...], ...]
    # these are the foods the user is most likely to eat
    main_food_names = []
    for idx in main_groups:
        foods = []
        group_foods = groups[idx]['foods']
        for i in range(2):
            foods.append(group_foods[randint(0, len(group_foods) - 1)])

        main_food_names.append(foods)

    # choose 3 main symptoms, store the indexes
    # [1, 7, 9, 12, ..]
    # these are the main symptoms the user records
    main_symptoms = [randint(0, len(symptoms) - num_s)]
    for i in range(1, num_s):
        main_symptoms.append(randint(main_symptoms[i - 1] + 1, len(symptoms) - num_s + i))

    all_symptoms = []
    all_meals = []

    # go through all the days
    for d in range(max_days):
        # skip based on consistency probability
        if(randint(0, 100) < consistency): continue

        symptom_prob = 0  # probability of a symptom occuring
        hour = randint(5, 8)  # hour of first meal
        num_meals = randint(2, max_meals)  # number of meals that day

        for m in range(num_meals):
            meal_foods = []  # to hold names of foods
            meal_groups = []  # to hold names of groups

            # include 1-6 foods
            for f in range(randint(1, 5)):
                groupIdx = None  # index of the group within the groups list
                foodIdx = None  # index of the food list in the main_foods list

                # probability the user will eat from the first main group
                if(randint(1, 100) <= food_flex):
                    groupIdx = main_groups[0]
                    foodIdx = 0
                # probability they'll eat another food from their main group
                elif(randint(1, 100) <= int(food_flex/3)):
                    foodIdx = randint(1, len(main_groups) - 1)
                    groupIdx = main_groups[foodIdx]
                else:
                # otherwise, choose a random group
                    foodIdx = None
                    groupIdx = randint(0, len(groups) - 1)

                # increase probability of symptom based on group eaten
                if(groupIdx == main_groups[0]):
                    symptom_prob += 2
                elif(groupIdx in main_groups):
                    symptom_prob += 1

                # record chosen group name
                chosen_group = groups[groupIdx]['group']

                # record possible foods
                possible_foods = None
                if(randint(0, 100) < 85 and foodIdx):
                    possible_foods = main_food_names[foodIdx]
                else:
                    possible_foods = groups[groupIdx]['foods']

                # choose a food
                chosen_food = possible_foods[randint(0, len(possible_foods) - 1)]

                # add foods and groups to the meal, if not already in the list
                if chosen_food not in meal_foods:
                    meal_foods.append(chosen_food)


                if chosen_group not in meal_groups:
                    meal_groups.append(chosen_group)

            all_meals.append(create_meal(meal_foods, meal_groups, hour, d, username))

            # choose the hour when the meal was eaten
            hour = hour + randint(1, 3)
            if hour > 23: hour = 23

        # probability of the symptom occuring
        if(randint(0, 10) <= symptom_prob):

            # add the main symptom
            all_symptoms.append(create_user_symptom(main_symptoms[0], int(symptom_prob), hour + randint(-3, 3), d + 1, username, symptoms))

            # possibly add another symptom
            if(randint(0, 100) <= int(symptom_thresh/2)):
                all_symptoms.append(create_user_symptom(main_symptoms[randint(1, len(main_symptoms) - 1)], int(symptom_prob), hour + randint(-3, 3), d + 1, username, symptoms))


    # make sure there are enough meals and symptoms to push to the database
    if(len(all_meals) < 20 or len(all_symptoms) < 20):
        print('not enough symptoms or meals')

    print(f'Seeding {len(all_meals)} meals and {len(all_symptoms)} symptoms for {max_days} days!')

    # sort the symptoms by date and insert into the database, then get the inserted user symptoms
    all_symptoms.sort(key=lambda s: s['datetime'])
    db.user_symptoms.insert_many(all_symptoms)
    user_symptoms = [s for s in db.user_symptoms.find({"username": username})]

    # sort the meals
    all_meals.sort(key=lambda m: m['datetime'])
    pointer = 0

    # loop thorugh the meals and symptoms, storing the object id of symptoms that are related to the given meal
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

        # add any symptoms within the 0 to 30 range
        while(i < len(user_symptoms) and 0 <= check_hour_dif(user_symptoms[i]['datetime'], time) <= 30):
            m['related_symptoms'].append(user_symptoms[i]['_id'])
            i += 1

    # insert the meals
    db.meals.insert_many(all_meals)



# format and create a user's symptom
def create_user_symptom(idx, prob, hour, day, username, symptoms):
    hour = hour % 23
    date = get_date(day, hour)
    severity = randint(prob - 3, prob + 2)
    if(severity > 10): severity = 10
    if(severity < 1): severity = 1

    return {'username': username, 'symptom': symptoms[idx]['name'], 'datetime': date, 'severity': severity}

# create a meal document
def create_meal(foods, groups, hour, day, username):
    date = get_date(day, hour % 23)

    return {'username': username, 'datetime': date, 'groups': groups, 'foods': foods, 'related_symptoms': []}

#  get the date based on the number of days passed
def get_date(day, hour):
    return datetime.datetime(2022, 1, 1, hour, 0) + datetime.timedelta(day)

#  check the hour difference between 2 times
def check_hour_dif(a, b):
    diff = a - b
    return diff.total_seconds()/3600

# seed function based on user input
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
    # run the seed function
    run_seed()
