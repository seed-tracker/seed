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


'''
new algo:
get all the user's meal, with associated symptoms
create itemsets of foods and meals, including all the user's symptoms


'''

from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import fpgrowth, association_rules, apriori, fpmax
import pandas as pd

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
    symptom_sets = {}

    # format the data
    for m in meals:
        if(len(m['related_symptoms']) > 0):
            symptoms = list(map(lambda s: s['symptom'], m['related_symptoms']))
            
            for s in symptoms:
                if(not s in symptom_sets): symptom_sets[s] = [[], [], 0]
                
                symptom_sets[s][0].append([s, *m['foods']])
                symptom_sets[s][1].append([s, *m['groups']])
                symptom_sets[s][2] += 1

        food_sets.append(m['foods'])
        group_sets.append(m['groups'])
        
    
    # get top 5 symptoms in separated lists
    top_symptoms = sorted(symptom_sets.items(), key=lambda x: -x[1][2])
    top_symptoms = list(filter(lambda t: t[1][2] > 20, top_symptoms))
    
    if(len(top_symptoms) < 1): return 'Not enough data'
    print(len(top_symptoms))

    for [name, data] in top_symptoms:
        food_rules = find_top_items(data[0], food_sets, name)
        group_rules = find_top_items(data[1], group_sets, name)
        print('foods:')
        print(food_rules.to_string())

        total_count = 0
        count = 0
        food = 'Eggs'
        for m in meals:
            if(food in m['groups']):
                total_count += 1
        for f in data[1]:
            if(food in f): count += 1

        print(food)
        print(f"Total: {total_count}")
        print(f"With symptom Total: {count}")


        print(f"symptom has occured {data[2]} times")
        print('groups:')
        print(group_rules.to_string())
    
    




# convert frozenset, drop non-unique values and filter out the symptom values
def convert_frozenset(fset, filter_val=None):
    return set(filter(lambda i: not i == filter_val ,fset.apply(lambda x: list(x)[0]).astype("unicode").tolist()))

def get_items(item_list, search):
    return list(filter(lambda i: bool(set(i) & search), item_list))

def find_top_items(item_sets, all_items, symptom_name):
    te = TransactionEncoder()
    te_items = te.fit(item_sets).transform(item_sets)
    items_df = pd.DataFrame(te_items, columns=te.columns_)
    freq_itemsets = fpgrowth(items_df, min_support=0.1, use_colnames=True)

    top_items = get_items(all_items, convert_frozenset(freq_itemsets['itemsets'], symptom_name))

    te_all_items = te.fit([*top_items, *item_sets]).transform([*top_items, *item_sets])
    all_items_df = pd.DataFrame(te_all_items, columns=te.columns_)
    freq_all_itemsets = fpgrowth(all_items_df, min_support=0.1, use_colnames=True)
    rules = association_rules(freq_all_itemsets, metric="lift", min_threshold=1.0).sort_values(by=['lift'], ascending=False)

    return rules
    

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