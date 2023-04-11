from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules
import pandas as pd
from functools import reduce

import sys

sys.path.insert(0, "..")
from db import db

# This file holds all the logic for the algorithm that analyzes' user's data to find correlations between foods and symptoms.
# It works by finding the user's most common symptoms, accumulating those symptoms and all of the user's meals into itemsets, and then running those through fpGrowth to find association rules between foods and symptoms
# It ranks foods based on their lift values, finds other data associating those foods and symptoms, and replaces previous correlations with the new ones


def find_correlations(username):
    print(f"Seeding for {username}")

    # query the meals, including symptoms
    pipeline = [
        {"$match": {"username": username}},
        {
            "$lookup": {
                "from": "user_symptoms",
                "localField": "related_symptoms",
                "foreignField": "_id",
                "pipeline": [
                    {"$project": {"symptom": 1, "datetime": 1, "severity": 1, "_id": 1}}
                ],
                "as": "related_symptoms",
            }
        },
    ]

    # get meals for a given user
    meals = [meal for meal in db.meals.aggregate(pipeline)]

    # get top 5 symptoms for a given user
    symptom_pipeline = [
        {"$match": {"username": username}},
        {
            "$group": {
                "_id": "$symptom",
                "count": {"$sum": 1},
                "avg_severity": {"$avg": "$severity"},
            }
        },
        {"$project": {"symptom": "$_id", "count": 1, "avg_severity": 1, "_id": 0}},
        {"$sort": {"count": -1}},
    ]

    # find the count of each of those symptoms
    # ex. [{'symptom': 'Headache', 'count': 100, 'avg_severity': 2.789}, ...]
    symptom_counts = list(
        filter(
            lambda symptom: symptom["count"] >= 50,
            [sym for sym in db.user_symptoms.aggregate(symptom_pipeline)],
        )
    )

    # stop if there's not enough data
    if len(symptom_counts) < 1:
        return "Not enough data"

    # creates a list of the symptom name strings: [symptom1, symptom2, ...]
    symptom_list = [s["symptom"] for s in symptom_counts]

    # print the count, avg severity, and name of the main symptoms
    print(
        pd.DataFrame(
            [list(s.values()) for s in symptom_counts],
            columns=["count", "avg_severity", "symptom"],
        )
    )

    # create sets with foods and meals
    # example: [[symptom, food, food, ...], [food, food, ...], [symptom, symptom2, food, food, ...]]
    food_sets = []
    group_sets = []

    # create item sets with foods and symptoms
    for meal in meals:
        # get related symptoms for that meal
        symptoms = []
        for sym in meal["related_symptoms"]:
            name = sym["symptom"]
            # only add top symptoms
            if name in symptom_list:
                symptoms.append(name)
        # add all to sets
        food_sets.append([*symptoms, *meal["foods"]])
        group_sets.append([*symptoms, *meal["groups"]])

    # holds correlation dictionaries that will go into mongoDB
    correlations = []

    # get data for each individual symptom
    for symptom in symptom_counts:
        name = symptom["symptom"]

        # create list to filter out other symptoms
        filters = list(filter(lambda sym: not sym == name, symptom_list))

        # get food and group rules
        food_rules = create_rules(food_sets, filters, name)
        group_rules = create_rules(group_sets, filters, name)

        # round the symptom's avg severity to 2 decimal points
        avg_severity = round(symptom["avg_severity"], 2)

        # find data for the top foods and group
        # ex. [{'name': 'Yerba Mate', 'avg_severity': 8.52, 'lift': 1.093, 'total_count': 329}, ...]
        food_data = find_data(name, food_rules, meals)
        group_data = find_data(name, group_rules, meals)

        # make sure there's enough data
        if not food_data and not group_data:
            print("Insufficient data")
            continue

        # add correlations to the list
        correlations.append(
            {
                "symptom": name,
                "username": username,
                "count": symptom["count"],
                "avg_severity": avg_severity,
                "top_foods": food_data,
                "top_groups": group_data,
            }
        )

    if len(correlations) > 0:
        # commented out for testing purposes
        # db.correlations.delete_many({"username": username})
        # db.correlations.insert_many(correlations)
        return
    else:
        print("Insufficient correlations data")
        return


# filters out unrelated symptoms
def filter_symptoms(items, symptom_list):
    return list(set(filter(lambda item: not item in symptom_list, items)))


# get association rules/frequent item sets
def create_rules(item_sets, filter_list, symptom_name):
    te = TransactionEncoder()

    # filter out the unrelated symptoms from itemsets
    filtered_items = list(map(lambda i: filter_symptoms(i, filter_list), item_sets))

    # fn to check data - will delete
    # print(check_data(filtered_items, symptom_name, 70))

    # run the data through fpgrowth and get association rules
    te_items = te.fit(filtered_items).transform(filtered_items)
    items_df = pd.DataFrame(te_items, columns=te.columns_)
    freq_itemsets = fpgrowth(items_df, min_support=0.1, use_colnames=True)
    if len(freq_itemsets) < 1:
        print("Not enough freq_itemsets")
        return
    rules = association_rules(
        freq_itemsets, metric="lift", min_threshold=1.0
    ).sort_values(by=["lift"], ascending=False)

    # get lift, consequents and antecedents
    data = list(
        zip(
            convert_frozenset(rules["antecedents"]),
            convert_frozenset(rules["consequents"]),
            list(rules["lift"]),
        )
    )

    # return the top 10 (or less) symptoms data, filtering out the symptom from the antecedent, consequent columns
    # returns
    return list(
        map(
            lambda row: [row[0], row[2]],
            list(filter(lambda col: col[1] == symptom_name, data)),
        )
    )[:10]


# function to find necessary data about correlated items
# item list = list of correlated items
def find_data(symptom_name, item_list, meals):
    # loop through the meals to get data
    data = {}
    for meal in meals:
        # get the average severity of the specified symptom (average out if there are multipe instances of it in a single item set), keep as none if the symptom isn't found
        severity = 0
        count = 0
        for s in meal["related_symptoms"]:
            if s["symptom"] == symptom_name:
                severity += s["severity"]
                count += 1

        # get avg severity of the symptom, accounting for the possibility of multiple of that symptom being included in the item set
        if severity:
            severity /= count

        # loop through correlated items
        for item in item_list:
            # reformat
            key = make_key(item[0])

            # see if the correlated item is in the foods list
            if item[0] in meal["foods"] or item[0] in meal["groups"]:
                # add the data if not already added
                if not key in data:
                    data[key] = {
                        "total_count": 0,
                        "severity_avg": 0,
                        "overlap": 0,
                        "lift": item[1],
                    }

                # update the count and average
                data[key]["total_count"] += 1
                if severity > 0:
                    data[key]["severity_avg"] += severity
                    data[key]["overlap"] += 1

    # round and format the accumulated data, find the score
    for item in item_list:
        key = make_key(item[0])
        # d = data dictionary for that item
        d = data[key]
        d["severity_avg"] = round(d["severity_avg"] / d["overlap"], 2)
        d["lift"] = round(d["lift"], 3)

    # sort by lift
    data = sorted(data.items(), key=lambda x: -x[1]["lift"])

    # return if insufficient data
    if len(data) < 1:
        print("Not enough data")
        return None

    # create and print a data frame to view the data in terminal
    create_df(data)

    # return the data, formatted for mongodb
    return list(
        map(
            lambda item: {
                "name": un_key(item[0]),
                "avg_severity": item[1]["severity_avg"],
                "lift": item[1]["lift"],
                "total_count": item[1]["total_count"],
            },
            data,
        )
    )[:10]


# fn to format keys
def make_key(item):
    return item.replace(" ", "_")


# function to unformat keys
def un_key(item):
    return item.replace("_", " ")


# convert frozenset, drop non-unique values and filter out the symptom values
def convert_frozenset(fset, filter_val=None):
    return list(
        filter(
            lambda i: not i == filter_val,
            fset.apply(lambda x: list(x)[0]).astype("unicode").tolist(),
        )
    )


def get_items(item_list, search):
    return list(filter(lambda i: bool(set(i) & search), item_list))


## THESE WILL BE DELETED EVENTUALLY:


# just for showing the data in terminal -- can delete later
def create_df(data):
    # format the data
    data_frame = []
    for i in data:
        data_frame.append(
            [i[0], i[1]["total_count"], i[1]["lift"], i[1]["severity_avg"]]
        )

    # create dataframe
    df = pd.DataFrame(data_frame, columns=["name", "count", "lift", "severity average"])

    # print the data
    print(df.to_string())


# extraneous function to check my work -- will delete later
def check_data(item_sets, symptom_name, min_threshold):
    item_count = {}

    for i in item_sets:
        for item in i:
            if not item == symptom_name:
                item = item.replace(" ", "_").replace("-", "_")
                if not item in item_count:
                    item_count[item] = {"total": 0, "overlap": 0}

                item_count[item]["total"] += 1

                if symptom_name in i:
                    item_count[item]["overlap"] += 1

    sorted_list = list(
        filter(
            lambda y: y[1]["overlap"] > min_threshold
            and y[1]["overlap"] / y[1]["total"] > 0.7,
            sorted(item_count.items(), key=lambda x: -x[1]["overlap"]),
        )
    )[:10]

    return sorted_list


if __name__ == "__main__":
    if input("Delete data? y or n  ") == "y":
        db.correlations.delete_many({})

    if input("All? y or n: ") == "y":
        users = db.users.find({})
        for user in users:
            find_correlations(user["username"])

    else:
        find_correlations(input("Username? "))

