# File to add food groups
import sys
sys.path.insert(0,"..")
from db import db

groups = db.groups

""" Seed the database with food groups

    name = name of the food group
    description = description of the food group
    """
foodGroups = [{ "name": "Fruit", "description": "berries, drupes, citrus, orchard, tropical, melon"}, {"name": "Beans, Peas, and Soy", "description": "edible seed, legume"}, {"name": "Vegetables, Non-Starchy", "description": "anything not considered starchy, lettuces, mustards, mushrooms, carrots"}, { "name": "Vegetables, Starchy", "description": "produces starch-like residue when soaked; powdery texture when cooked, squash/yams, potato, corn"}, {"name": "Grains, Gluten-Free", "description": "rice, quinoa, oats, buckwheat, sorghum, amaranth, teff, millet"}, {"name": "Grains, Gluten", "description": "anything not considered gluten-free, wheat, rye, barley, farro, most pastas"}, {"name": "Fish", "description": "anything with a tail that swims"}, {"name": "Shellfish", "description": "anything with a hard or soft exoskeleton, crabs, lobsters, clams, mussels, shrimp"}, {"name": "Other Seafoods", "description": "aquatic organisms neither a fish or a shellfish"}, {"name": "Eggs", "description": "all eggs, poultry eggs, duck eggs, quail eggs"}, {"name": "Beef", "description": "any part of a cow"}, {"name": "Pork", "description": "any part of a pig"}, {"name": "Poultry", "description": "any domesticated bird, chicken, turkey, fowl"}, {"name": "Lamb", "description": "any part of the lamb"}, {"name": "Goat", "description": "any part of the goat"},
{"name": "Nuts and Seeds", "description": "tree nuts, nut butters, peanuts"}, {"name": "Milk, Yogurt, and Cheese", "description": ", made from dairy "}, {"name": "Processed Foods", "description": "largely manufactured, canned, boxed, microwaveable, OR foods high in sodium OR foods high in saturated or trans fat "}, {"name": "Refined Sugars", "description": " any foods with added sugar such as: chocolate, ice cream, cookies, cocktails, soda, non-fresh juice, canned fruits or fruits w/ added juice, dressings & spreads"},
{"name": "Alcholic Beverages", "description": "wine, spirits, and beers"}, {"name": "Caffeinated Beverages", "description": "coffee, tea, energy drinks"}]

groups.insert_many(foodGroups)
