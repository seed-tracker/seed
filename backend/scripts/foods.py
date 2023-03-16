import sys
sys.path.insert(0, "..")
from db import db
from bson.objectid import ObjectId
foods = db.foods

foods.insert_many([{"name": "Lamb, chop", "group_id": [ObjectId("64137d120b63ba8c0db0d680")]},
                   {"name": "Lamb, ground", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d680")]},
                   {"name": "Lamb or mutton loaf", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d680")]},
                   {"name": "Lamb, New Zealand, imported, brains, raw",
                    "group_id": [ObjectId("64137d120b63ba8c0db0d680")]},
                   {"name": "Lamb, New Zealand, imported, heart, raw",
                    "group_id": [ObjectId("64137d120b63ba8c0db0d680")]},
                   {"name": "Oysters, canned", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67a")]},
                   {"name": "Mollusks", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67a")]},
                   {"name": "Oysters, raw", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67a")]},
                   {"name": "Clams, canned", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67a")]},
                   {"name": "Clams, raw", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67a")]},
                   {"name": "Sea Urchin", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67b")]},
                   {"name": "Octopus", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67b")]},
                   {"name": "Squid", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67b")]},
                   {"name": "Sea Cucumber", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67b")]},
                   {"name": "Caviar", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67b")]},
                   {"name": "Conventional Eggs", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67c")]},
                   {"name": "Duck Egg", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67c")]},
                   {"name": "Quail Egg", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67c")]},
                   {"name": "Cage-free Egg",
                    "group_id": [ObjectId("64137d120b63ba8c0db0d67c")]},
                   {"name": "Organic Eggs", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67c")]},
                   {"name": "Ribeye Steak", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67d")]},
                   {"name": "NY Strip Steak", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67d")]},
                   {"name": "Tritip", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67d")]},
                   {"name": "Beef, Ground", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67d")]},
                   {"name": "Beef Hamburger Patty", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67d"), ObjectId("64137d120b63ba8c0db0d67c")]},
                   {"name": "Ground Pork", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67e")]},
                   {"name": "Boneless Pork Chop", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67e")]},
                   {"name": "Bone-in Pork Chop",
                    "group_id": [ObjectId("64137d120b63ba8c0db0d67e")]},
                   {"name": "Pork ear", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67e")]},
                   {"name": "Pork hoof", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67e")]},
                   {"name": "Whole Chicken", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67f")]},
                   {"name": "Chicken liver", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67f")]},
                   {"name": "Chicken Breast", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67f")]},
                   {"name": "Chicken Thigh", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67f")]},
                   {"name": "Whole Duck", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67f")]},
                   {"name": "Whole Turkey", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d67f")]},
                   {"name": "Sake", "group_id": [
                       ObjectId('64137d120b63ba8c0db0d686'), ObjectId('64137d120b63ba8c0db0d677')]},
                   {"name": "Beer", "group_id": [
                       ObjectId('64137d120b63ba8c0db0d686'), ObjectId('64137d120b63ba8c0db0d678')]},
                   {"name": "Wine, Rose", "group_id": [
                       ObjectId('64137d120b63ba8c0db0d686')]},
                   {"name": "Daiquiri", "group_id": [ObjectId('64137d120b63ba8c0db0d686'), ObjectId(
                       '64137d120b63ba8c0db0d685'), ObjectId('64137d120b63ba8c0db0d673')]},
                   {"name": "Vodka", "group_id": [
                       ObjectId('64137d120b63ba8c0db0d686'), ObjectId('64137d120b63ba8c0db0d678')]},
                   {"name": 'Coffee, Black', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d687')]},
                   {"name": 'Tea, Black', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d687')]},
                   {"name": 'Yerba Mate', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d687')]},
                   {"name": 'Energy Drink', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d687'), ObjectId('64137d120b63ba8c0db0d685')]},
                   {"name": 'Cola', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d687'), ObjectId('64137d120b63ba8c0db0d685')]},
                   {"name": 'Donut', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d685'), ObjectId('64137d120b63ba8c0db0d684')]},
                   {"name": 'Cereal, Sugary', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d685'), ObjectId('64137d120b63ba8c0db0d684')]},
                   {"name": 'Cookie, Chocolate Chip', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d685'), ObjectId('64137d120b63ba8c0db0d684')]},
                   {"name": 'Candy Bar', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d685'), ObjectId('64137d120b63ba8c0db0d684')]},
                   {"name": 'Cupcake', "group_id": [
                       ObjectId('64137d120b63ba8c0db0d685'), ObjectId('64137d120b63ba8c0db0d684')]},
                   {"name": "Aloo Matar", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d681")]},
                   {"name": "Goat Curry", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d681")]},
                   {"name": "Adobong Kambing", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d681")]},
                   {"name": "Boodog", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d681")]},
                   {"name": "Birria", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d681")]},
                   {"name": "Walnut", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d682")]},
                   {"name": "Almond", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d682")]},
                   {"name": "Pistachio", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d682")]},
                   {"name": "Peanut", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d682")]},
                   {"name": "Cashew", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d682")]},
                   {"name": "Parmesan", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d683")]},
                   {"name": "Brie", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d683")]},
                   {"name": "Cheddar", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d683")]},
                   {"name": "Greek Yogurt", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d683")]},
                   {"name": "Labneh", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d683")]},
                   {"name": "Skyr", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d683")]},
                   {"name": "Vanilla Ice Cream", "group_id": [ObjectId("64137d120b63ba8c0db0d683"), ObjectId(
                       "64137d120b63ba8c0db0d684"), ObjectId("64137d120b63ba8c0db0d685")]},
                   {"name": "Whole Milk", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d683")]},
                   {"name": "Goat Cheese", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d683")]},
                   {"name": "Chips", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Pretzels", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Hot Dog", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684"), ObjectId("64137d120b63ba8c0db0d67e")]},
                   {"name": "Ramen", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684"), ObjectId("64137d120b63ba8c0db0d678")]},
                   {"name": "Crackers", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684"), ObjectId("64137d120b63ba8c0db0d678")]},
                   {"name": "French Fries", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d676")]},
                   {"name": "Popcorn", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Nachos", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Rice Crackers", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Seaweed Snacks", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Chex Mix", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Pizza", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Cheetos", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Apple", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d673")]},
                   {"name": "Banana", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d673")]},
                   {"name": "Blueberry", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d673")]},
                   {"name": "Orange", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d673")]},
                   {"name": "Dragon fruit", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d673")]},
                   {"name": "Soy chips", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d674"), ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Soy milk", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d674")]},
                   {"name": "Bean chips", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d674"), ObjectId("64137d120b63ba8c0db0d684")]},
                   {"name": "Green beans, raw", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d674")]},
                   {"name": "Wasabi peas", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d674")]},
                   {"name": "Cucumber salad with vinegar and onions",
                    "group_id": [ObjectId("64137d120b63ba8c0db0d675")]},
                   {"name": "Broccoli and beef", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d675"), ObjectId("64137d120b63ba8c0db0d67d")]},
                   {"name": "Mushroom, portabella", "group_id": [
                       ObjectId("64137d120b63ba8c0db0d675")]},
                   {"name": "Guacamole with tomatoes", "group_id": [ObjectId("64137d120b63ba8c0db0d675")]}, {
    "name": "Carrots", "group_id": [ObjectId("64137d120b63ba8c0db0d675")]},
    {"name": "Asparagus", "group_id": [ObjectId("64137d120b63ba8c0db0d675")]},
    {"name": "Chickpeas", "group_id": [ObjectId("64137d120b63ba8c0db0d676")]},
    {"name": "Beans, kidney, navy, pinto, black, cannellini", "group_id": [
        ObjectId("64137d120b63ba8c0db0d676"), ObjectId("64137d120b63ba8c0db0d674")]},
    {"name": "Potatoes", "group_id": [ObjectId("64137d120b63ba8c0db0d676")]},
    {"name": "Yams", "group_id": [ObjectId("64137d120b63ba8c0db0d676")]},
    {"name": "Corn", "group_id": [ObjectId("64137d120b63ba8c0db0d676")]},
    {"name": "Oats", "group_id": [ObjectId("64137d120b63ba8c0db0d677")]},
    {"name": "Quinoa", "group_id": [ObjectId("64137d120b63ba8c0db0d677")]},
    {"name": "Rice", "group_id": [ObjectId("64137d120b63ba8c0db0d677")]},
    {"name": "Buckwheat", "group_id": [ObjectId("64137d120b63ba8c0db0d677")]},
    {"name": "Amaranth", "group_id": [ObjectId("64137d120b63ba8c0db0d677")]},
    {"name": "Bagels", "group_id": [ObjectId("64137d120b63ba8c0db0d678")]},
    {"name": "Doughnuts", "group_id": [
        ObjectId("64137d120b63ba8c0db0d678"), ObjectId("64137d120b63ba8c0db0d685")]},
    {"name": "Pasta", "group_id": [ObjectId("64137d120b63ba8c0db0d678")]},
    {"name": "Cereal", "group_id": [
        ObjectId("64137d120b63ba8c0db0d678"), ObjectId("64137d120b63ba8c0db0d684")]},
    {"name": "Bread", "group_id": [ObjectId("64137d120b63ba8c0db0d678")]},
    {"name": "Salmon", "group_id": [ObjectId("64137d120b63ba8c0db0d679")]},
    {"name": "Tilapia", "group_id": [ObjectId("64137d120b63ba8c0db0d679")]},
    {"name": "Tuna", "group_id": [ObjectId("64137d120b63ba8c0db0d679")]},
    {"name": "Cod", "group_id": [ObjectId("64137d120b63ba8c0db0d679")]},
    {"name": "Haddock", "group_id": [ObjectId("64137d120b63ba8c0db0d679")]}])
