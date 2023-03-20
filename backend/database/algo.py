# 1. grab all the user's symptom collections

# {
#     'symptom': <symptom1_name>,
#       'severity': num,
#     'foods': [...],
#     'groups': [...]
# }


# 2. parse into dataframe with pymongoarrow

# question: do I want to pass each food set and group set altogether OR do I want to pass 1 food/group and one symptom at a time? If I pass them all together, I need to parse out the grouping by food. So maybe pass the foods, groups one at a time
# 3. pass the food sets and groups sets w/ associated symptoms into fpGrowth
    # add min frequency to parse out symptoms that have barely shown up
# 4. take the top 5 or so foods and groups for each symptom
# 5. with each of those foods and groups, go through the symptoms, looking for the spots where the foods show up and averaging the severity (do this all foods, groups at a time, so you're not looping again and again) -- don't count foods twice
# 6. at the same time, find the average time passed between each food and symptom
# 7. divide the severity score by 10
# 8. multiply the severity * lift
# 9. create correlations from the avg time passed, severity, lift, score -- ranked by score, and ranking of most common symptoms, and username and symptom name
# 10. remove previous correlations and insert new ones


from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules
import pandas as pd
from functools import reduce

import sys
sys.path.insert(0,"..")
from db import db

def find_correlations():
    # find top 10 or less symptoms
    # use those to find all associated foods and food groups
    # unwind foods and food groups
    # do I want to do two different calculations: food groups and foods? probably
    
    # new way of doing this:
    pipeline = [
        {
            "$match": {
                "username": "oellis"
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
                            "_id": 0
                        }
                    }
                  
                ],
                "as": "related_symptoms"
            }
        }
    ]

    meals = [m for m in db.meals.aggregate(pipeline)]

    food_sets = []
    group_sets = []
    symptom_set = {}

    # format the data
    for m in meals:
        symptoms = []
        for s in m['related_symptoms']:
            name = s['symptom']
            symptoms.append(name)
            if(not name in symptom_set):
                symptom_set[name] = 0

            symptom_set[name]+= 1
        
        food_sets.append([*symptoms, *m['foods']])
        group_sets.append([*symptoms, *m['groups']])
    
    # get top 5 symptoms
    top_symptoms = list(filter(lambda y: y[1] > 20, sorted(symptom_set.items(), key=lambda x: -x[1])))[:5]



    
    # top_symptoms = list(map(lambda t: {'symptom': t[0], 'count': t[1]['count'], 'foods': t[1]['foods'], 'groups': t[1]['groups']}, sorted(symptom_sets.items(), key=lambda x: -x[1]['count'])))[:5]

    # top_symptoms = (list(filter(lambda t: t['count'] > 20, top_symptoms)))

    
    if(len(top_symptoms) < 1): return 'Not enough data'



    symptom_list = [k for k in symptom_set.keys()]

    for sym in top_symptoms:
        name = sym[0]
        filters = list(filter(lambda i: not i == name, symptom_list))
        food_rules = create_rules(food_sets, filters, name)
        group_rules = create_rules(group_sets, filters, name)

        print(food_rules)
        print(group_rules)

        print(find_data(name, group_rules, meals))
    
    
def filter_symptoms(items, symptom_list):
    return list(set(filter(lambda i: not i in symptom_list, items)))

def create_rules(item_sets, filter_list, symptom_name):
    te = TransactionEncoder()

    filtered_items = list(map(lambda i: filter_symptoms(i, filter_list), item_sets))

    te_items = te.fit(filtered_items).transform(filtered_items)
    items_df = pd.DataFrame(te_items, columns=te.columns_)
    freq_itemsets = fpgrowth(items_df, min_support=0.1, use_colnames=True)
    rules = association_rules(freq_itemsets, metric="lift", min_threshold=0.9).sort_values(by=['lift'], ascending=False)

    data = list(zip(convert_frozenset(rules['antecedents']), convert_frozenset(rules['consequents']), list(rules['lift'])))
    
    return list(map(lambda y: [y[0], y[2]], list(filter(lambda x: x[1] == symptom_name, data))))[:10]


def find_data(symptom_name, item_list, meals):
    data = {}
    symptom_count = 0
    avg_severity_sum = 0
    for m in meals:
        severity = None
        for s in m['related_symptoms']:
            if(s['symptom'] == symptom_name):
                severity = s['severity']
                avg_severity_sum += s['severity']
                symptom_count += 1
        for i in item_list:
            key = i[0].replace(" ", "_")
            if(i[0] in m['foods'] or i[0] in m['groups']):
                if(not key in data): data[key] = {'total_count': 0, 'severity_avg': 0, 'overlap': 0, 'lift': i[1]}
                data[key]['total_count'] += 1
                if(severity):
                    data[key]['severity_avg'] += severity
                    data[key]['overlap'] += 1

        print(avg_severity_sum, symptom_count)
        if(symptom_count > 0): avg_severity_sum /= symptom_count

    for i in item_list:
        key = i[0].replace(" ", "_")
        d = data[key]
        d['severity_avg'] /= d['overlap']
        d['overlap_percent'] = d['overlap']/symptom_count
        d['score'] = d['lift'] * d['severity_avg']/avg_severity_sum

    
    return {'symptom': symptom_name, 'count': symptom_count, 'avg_severity': avg_severity_sum, 'data': data}

                

# convert frozenset, drop non-unique values and filter out the symptom values
def convert_frozenset(fset, filter_val=None):
    return list(filter(lambda i: not i == filter_val ,fset.apply(lambda x: list(x)[0]).astype("unicode").tolist()))

def get_items(item_list, search):
    return list(filter(lambda i: bool(set(i) & search), item_list))

if __name__ == '__main__':
    find_correlations()



    # pipeline = [
    #     { "$match": {
    #             "username": "hillandrew"
    #         }
    #     }, {
    #         "$group": {
    #             "_id": "$symptom",
    #             "frequency": { "$sum": 1 },
    #             "avg_severity": {"$avg": "$severity"},
    #             "meal_dates": { "$push": {"meals": "$meals", "symptom_datetime": {"$toDate": "$datetime"}, "severity": "$severity"}}
    #         }
    #     },
    #     { "$sort": { "frequency": -1 }
    #     }, { "$limit": 5 },
    #     { "$unwind": "$meal_dates" },
    #     {
    #         "$project": {
    #             "_id": 0,
    #             "symptom_name": "$_id",
    #             "avg_severity": 1,
    #             "meal": "$meal_dates.meals",
    #             "symptom_datetime": "$meal_dates.symptom_datetime",
    #             "severity": "$meal_dates.severity",
    #             "total_frequency": "$frequency"
    #         }
    #     },
    #     { "$unwind": "$meal" }, {
    #         "$lookup": {
    #             "from": "meals",
    #             "localField": "meal",
    #             "foreignField": "_id",
    #             "pipeline": [
    #                 {
    #                     "$project": {
    #                         "groups": 1,
    #                         "foods": 1,
    #                         "datetime": 1,
    #                         "_id": 0
    #                     }
    #                 }
    #             ],
    #             "as": "meal"
    #         }
    #     }, 
    #     { 
    #         "$project": {
    #             "symptom_name": 1,
    #             "total_frequency": 1,
    #             "avg_severity": 1,
    #             "data": {
    #             "severity": "$severity", 
    #             "groups": {"$first": "$meal.groups"}, "foods": {"$first": "$meal.foods"},  "time_diff": {"$dateDiff": {
    #                 "startDate": {
    #                     "$toDate": {
    #                         "$first": "$meal.datetime"}
    #                 },
    #                 "endDate": "$symptom_datetime",
    #                 "unit": "hour"
    #             },
    #         }
    #     }}},
    #     {
    #         "$group": {
    #             "_id": {"name": "$symptom_name",
    #             "frequency": "$total_frequency", "avg_severity": "$avg_severity"},
    #             "data": {
    #                 "$push": "$data"
    #             }
    #         }
    #     }, { "$sort": { "_id.frequency": -1 }
    #     }    
    # ]

    # symptoms = [s for s in db.user_symptoms.aggregate(pipeline)]


    # '''
    # ideal schema for item sets:
    # groups:
    #     [symptom, group], [symptom, group], etc.

    # foods:
    #     [symptom, food], [symptom, food], etc.

    # '''