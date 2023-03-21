import sys
sys.path.insert(0,"..")
from db import db

def change_group_ids():
    
    pipeline = [
        {
            '$unwind': '$group_id'
        },
        {
            '$lookup': {
                'from': 'groups',
                'localField': 'group_id',
                'foreignField': '_id',
                'as': 'group_arr'
            }
        },
        {
            '$unwind': '$group_arr'
        },
        {
            '$project': {
                '_id': 1,
                'name': 1,
                'group_arr': {'name': 1}
            }
        },
        {
            '$group': {
                '_id': {
                    '_id': '$_id',
                    'name': '$name'
                    },
                'groups': {'$push': '$group_arr.name'}
            }
        },
        {
            '$project': {
                '_id': '$_id._id',
                'name': '$_id.name',
                'groups': 1
            }
        }
        
    ]

    # foods = db.food_test_temporary.aggregate(pipeline)
    # db.new_foods.insert_many(foods)
