from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules
import pandas as pd
from functools import reduce

import sys
sys.path.insert(0,"..")
from db import db



def find_correlations(username):

    # query the meals, including symptoms
    pipeline = [
        {
            "$match": {
                "username": username
            }
        },
        {
            "$lookup": {
                "from": "user_symptoms",
                "localField": "related_symptoms",
                "foreignField": "_id",
                "pipeline": [
                    {
                        "$project": {
                            "symptom": 1,
                            "datetime": 1,
                            "severity": 1,
                            "_id": 1
                        }
                    }
                ],
                "as": "related_symptoms"
            }
        }
    ]

    meals = [m for m in db.meals.aggregate(pipeline)]
    
    # get top 5 symptoms
    s_pipeline = [
        {
            "$match": {
                "username": username
            }
        },
        {
            "$group": {
                "_id": "$symptom",
                "count": {"$sum": 1},
                "avg_severity": {"$avg": "$severity"}
            }
        }, 
        {
            "$project": {
                "symptom": "$_id",
                "count": 1,
                "avg_severity": 1,
                "_id": 0
            }
        }, {"$sort": {"count": -1}}
    ]


    # find the count of each of those symptoms
    symptom_counts = list(filter(lambda c: c['count'] >= 25, [s for s in db.user_symptoms.aggregate(s_pipeline)]))

    # stop if there's not enough data
    if(len(symptom_counts) < 1): return 'Not enough data'

    symptom_list = [s['symptom'] for s in symptom_counts]


    # create sets with foods and meals
    food_sets = []
    group_sets = []

    # create item sets with foods and symptoms
    for m in meals:
        symptoms = []
        for s in m['related_symptoms']:
            name = s['symptom']
            if(name in symptom_list):
                symptoms.append(name)

        food_sets.append([*symptoms, *m['foods']])
        group_sets.append([*symptoms, *m['groups']])

    # get data for each individual symptom
    for name in symptom_list:
        # create list to filter out other symptoms
        filters = list(filter(lambda i: not i == name, symptom_list))

        # get food and group rules
        food_rules = create_rules(food_sets, filters, name)
        group_rules = create_rules(group_sets, filters, name)

        # find data for the top foods and group
        data_groups = find_data(name, group_rules, meals, symptom_counts)
        data_foods = find_data(name, food_rules, meals, symptom_counts)

        # to do: format and push data to correlations collection



def filter_symptoms(items, symptom_list):
    return list(set(filter(lambda i: not i in symptom_list, items)))

# get association rules
def create_rules(item_sets, filter_list, symptom_name):
    te = TransactionEncoder()

    # filter out the unrelated symptoms
    filtered_items = list(map(lambda i: filter_symptoms(i, filter_list), item_sets))

    # run the data through fpgrowth and get association rules
    te_items = te.fit(filtered_items).transform(filtered_items)
    items_df = pd.DataFrame(te_items, columns=te.columns_)
    freq_itemsets = fpgrowth(items_df, min_support=0.1, use_colnames=True)
    rules = association_rules(freq_itemsets, metric="lift", min_threshold=0.9).sort_values(by=['lift'], ascending=False)

    # get lift, consequents and antecedents
    data = list(zip(convert_frozenset(rules['antecedents']), convert_frozenset(rules['consequents']), list(rules['lift'])))
    
    # return the top 10 (or less) symptoms data, filtering out the symptom
    return list(map(lambda y: [y[0], y[2]], list(filter(lambda x: x[1] == symptom_name, data))))[:10]


def find_data(symptom_name, item_list, meals, symptom_counts):
    # get the symptom's data
    avg_severity = 0
    symptom_count = 0
    for s in symptom_counts:
        if(s['symptom'] == symptom_name):
            symptom_count = s['count']
            avg_severity = round(s['avg_severity'], 2)


    # loop through the meals to get data
    data = {}
    for m in meals:

        # get the average severity of the related symptoms (average out if there are multipe related instances), keep as none if the symptom isn't found
        severity = None
        count = 1
        for s in m['related_symptoms']:
            if(s['symptom'] == symptom_name):     
                severity = s['severity']
                count += 1

        # get avg
        if(severity): severity /= count

        for i in item_list:
            # reformat
            key = make_key(i[0])

            # add data for the foods
            if(i[0] in m['foods'] or i[0] in m['groups']):
                # add the data if not already added
                if(not key in data): data[key] = {'total_count': 0, 'severity_avg': 0, 'overlap': 0, 'lift': i[1]}

                # update the count and average
                data[key]['total_count'] += 1
                if(severity):
                    data[key]['severity_avg'] += severity
                    data[key]['overlap'] += 1

    # round and format the accumulated data, find the score
    for i in item_list:
        key = make_key(i[0])
        d = data[key]
        d['severity_avg'] = round(d['severity_avg']/d['overlap'], 2)
        d['overlap_percent'] = round(d['overlap']/d['total_count'], 2)
        d['score'] = round(d['lift'] * d['overlap_percent'] * d['severity_avg']/avg_severity, 2)
        d['lift'] = round(d['lift'], 3)

    # sort by score
    data = sorted(data.items(), key=lambda x: -x[1]['score'])

    # create and print a data frame to view the data in terminal
    create_df(data)
    
    # return the data, formatted for mongodb
    return {'symptom': symptom_name, 'count': symptom_count, 'avg_severity': avg_severity, 'data': data}


# fn to format keys
def make_key(item):
    return item.replace(" ", "_")

# convert frozenset, drop non-unique values and filter out the symptom values
def convert_frozenset(fset, filter_val=None):
    return list(filter(lambda i: not i == filter_val ,fset.apply(lambda x: list(x)[0]).astype("unicode").tolist()))


def get_items(item_list, search):
    return list(filter(lambda i: bool(set(i) & search), item_list))


## THESE WILL BE DELETED:

# just for showing the data in terminal -- can delete later
def create_df(data):
    # format the data
    data_frame = []
    for i in data:
        data_frame.append([i[0], i[1]['total_count'], i[1]['lift'], i[1]['overlap_percent'], i[1]['severity_avg'], i[1]['score']])
    
    # create dataframe
    df = pd.DataFrame(data_frame, columns=['name', 'count', 'lift', 'overlap percent', 'severity average', 'score'])

    # print the data
    print(df.to_string())

# extraneous function to check my work -- will delete later
def check_data(item_sets, symptom_name, symptom_keys):
    filtered_items = list(map(lambda i: filter_symptoms(i, symptom_keys), item_sets))

    item_count = {}

    for i in filtered_items:
        for item in i:
            if(not item == symptom_name):
                item = item.replace(" ", "_").replace('-','_')
                if(not item in item_count):
                    item_count[item] = {'total': 0, 'overlap': 0}

                item_count[item]['total'] += 1

                if(symptom_name in i):
                    item_count[item]['overlap'] += 1
    
    sorted_list = list(filter(lambda y: y[1]['overlap'] > 5, sorted(item_count.items(), key=lambda x: -x[1]['overlap'])))[:5]

    return sorted_list


if __name__ == '__main__':
    find_correlations('nortoncassandra')