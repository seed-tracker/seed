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

import sys
sys.path.insert(0,"..")
from db import db

def find_correlations():
    # find top 10 or less symptoms
    # use those to find all associated foods and food groups
    # unwind foods and food groups
    # do I want to do two different calculations: food groups and foods? probably
    #  
    pipeline = [
        { "$match": {
                "username": "blackchristopher"
            }
        }, {
            "$group": {
                "_id": "$symptom",
                "frequency": { "$sum": 1 },
                "avg_severity": {"$avg": "$severity"},
                "meal_dates": { "$push": {"meals": "$meals", "symptom_datetime": {"$toDate": "$datetime"}, "severity": "$severity"}}
            }
        },
        { "$sort": { "frequency": -1 }
        }, { "$limit": 5 },
        { "$unwind": "$meal_dates" },
        {
            "$project": {
                "_id": 0,
                "symptom_name": "$_id",
                "avg_severity": 1,
                "meal": "$meal_dates.meals",
                "symptom_datetime": "$meal_dates.symptom_datetime",
                "severity": "$meal_dates.severity",
                "total_frequency": "$frequency"
            }
        },
        { "$unwind": "$meal" }, {
            "$lookup": {
                "from": "meals",
                "localField": "meal",
                "foreignField": "_id",
                "pipeline": [
                    {
                        "$project": {
                            "groups": 1,
                            "foods": 1,
                            "datetime": 1,
                            "_id": 0
                        }
                    }
                ],
                "as": "meal"
            }
        }, 
        { 
            "$project": {
                "symptom_name": 1,
                "total_frequency": 1,
                "avg_severity": 1,
                "data": {
                "severity": "$severity", 
                "groups": {"$first": "$meal.groups"}, "foods": {"$first": "$meal.foods"},  "time_diff": {"$dateDiff": {
                    "startDate": {
                        "$toDate": {
                            "$first": "$meal.datetime"}
                    },
                    "endDate": "$symptom_datetime",
                    "unit": "hour"
                },
            }
        }}},
        {
            "$group": {
                "_id": {"name": "$symptom_name",
                "frequency": "$total_frequency", "avg_severity": "$avg_severity"},
                "data": {
                    "$push": "$data"
                }
            }
        }    
    ]

    sym = [s for s in db.user_symptoms.aggregate(pipeline)]
    print(sym[0]['_id'])

if __name__ == '__main__':
    find_correlations()