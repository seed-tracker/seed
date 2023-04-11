import sys
sys.path.insert(0,"..")
from db import db

# schema validation:

users_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "username", "email", "password", "birthdate"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "required and must be a string",
                "minLength": 2
            },
            "username": {
                "bsonType": "string",
                "description": "required and must be a string",
                "minLength": 2
            },
            "password": {
                "bsonType": "string",
                "description": "required and must be a string",
                "minLength": 5
            },
            "email": {
                "bsonType": "string",
                "description": "required and must be a string",
                "minLength": 5
            },
            "birthdate": {
                "bsonType": "date",
                "description": "required and must be a date"
            }
        }
    }
}

meals_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["datetime", "groups", "foods"],
        "properties": {
            "datetime": {
                "bsonType": "date",
                "description": "required and must be a date"
            },
            "groups": {
                "bsonType": "array",
                "description": "required and must be an array of group object ids from groups collection"
            },
            "foods": {
                "bsonType": "array",
                "description": "required and must be an array of food object ids from foods collection"
            }  
        }
    }
}

correlations_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [ "symptom_name", "username"],
        "properties": {
            "symptom_name": {
                "bsonType": "string",
                "description": "name of symptom. required.",
            },
            "username": {
                "bsonType": "string",
                "description": "object id of user. required",
            },
            "top_groups": {
                "bsonType": "array",
                "description": "Must be an array of group ids from groups collection with corresponding lift, severity, name and total score",
            },
            "top_foods": {
                "bsonType": "array",
                "description": "Must be an array of food object ids from foods collection with corresponding lift, severity, name and total score"
            }  
        }
    }
}

food_groups_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "name of the food group, required and must be a string",
                "minLength": 2
            },
            "description": {
                "bsonType": "string",
                "description": "description of the food group, must be a string",
                "minLength": 2
            }
        }
    }
}

foods_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "group_id"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "name of the food based on USDA data, required and must be a string",
                "minLength": 2
            },
            "groups": {
                "bsonType": "array",
                "description": "array of related food groups with name and id. Required. Can be only one group.",
            }
        }
    }
}

symptom_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "name of the symptom, required and must be a string",
                "minLength": 2
            }
        }
    }
}

user_symptoms_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "user_id", "symptom_id", "category", "datetime", "severity"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "name of the symptom (related to the symptom_id), required and must be a string",
                "minLength": 2
            },
            "user_id": {
                "bsonType": "objectId",
                "description": "id of a specific user. required."
            },
            "symptom_id": {
                "bsonType": "objectId",
                "description": "id of a specific symptom from the symptoms collection. required."
            },
            "datetime": {
                "bsonType": "date",
                "description": "required and must be the time the symptom started"
            },
            "meals": {
                "bsonType": "array",
                "description": "array of related meal object ids"
            }  
        }
    }
}

def create_schemas():
    try: 
        print('Adding schema validation...')

        db.command("collMod", "users", validator=users_validator)
        db.command("collMod", "meals", validator=meals_validator)
        db.command("collMod", "correlations", validator=correlations_validator)
        db.command("collMod", "groups", validator=foods_groups_validator)
        db.command("collMod", "foods", validator=foods_validator)
        db.command("collMod", "symptoms", validator=symptoms_validator)
        db.command("collMod", "user_symptoms", validator=user_symptoms_validator)

        print('Success!')

    except Exception as e:
        print('Something went wrong:', e)


if __name__ == "__main__":
  create_schemas()
