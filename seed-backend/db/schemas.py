
users_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "username", "email", "password", "birthday"],
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
                "description": "required and must be an array of group ids"
            },
            "foods": {
                "bsonType": "array",
                "description": "required and must be an array of food ids"
            }  
        }
    }
}

correlations_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["symptom_id", "symptom_name", "user_id", "top_foods", "top_groups"],
        "properties": {
            "symptom_id": {
                "bsonType": "objectId",
                "description": "id of related symptom. required",
            },
            "symptom_name": {
                "bsonType": "string",
                "description": "name of symptom. required.",
            },
            "user_id": {
                "bsonType": "objectId",
                "description": "id of user. required",
            },
            "top_groups": {
                "bsonType": "array",
                "description": "required and must be an array of group ids",
            },
            "top_foods": {
                "bsonType": "array",
                "description": "required and must be an array of food ids",
                "items": {
                    "bsonType": "object",
                    "description": "at least one food with the name and id of the food"
                }
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
            "group_id": {
                "bsonType": "array",
                "description": "array of related food groups. Required. Can be only one group.",
            }
        }
    }
}

symptom_validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["name", "categories"],
        "properties": {
            "name": {
                "bsonType": "string",
                "description": "name of the symptom, required and must be a string",
                "minLength": 2
            },
            "categories": {
                "bsonType": "array",
                "description": "array of related categories. Required. Can be only one group."
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
            "category": {
                "bsonType": "array",
                "description": "array of categories. required."
            },
            "datetime": {
                "bsonType": "date",
                "description": "required and must be the time the symptom started"
            },
            "meals": {
                "bsonType: "array",
                "description": "array of related meal ids"
            }  
        }
    }
}

def schemas()
    try: 
        print('Adding schema validation...')

        production.command("collMod", "users", validator=users_validator)
        production.command("collMod", "meals", validator=meals_validator)
        production.command("collMod", "correlations", validator=correlations_validator)
        production.command("collMod", "groups", validator=foods_groups_validator)
        production.command("collMod", "foods", validator=foods_validator)
        production.command("collMod", "symptoms", validator=symptoms_validator)
        production.command("collMod", "user_symptoms", validator=user_symptoms_validator)

        print('Success!')

    except:
        print('Something went wrong!')

