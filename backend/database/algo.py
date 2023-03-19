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