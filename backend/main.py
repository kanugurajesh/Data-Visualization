from pymongo import MongoClient
import json

# Connect to the MongoDB container
client = MongoClient('mongodb://localhost:27017/')

# Select the database and collection
db = client["mydatabase"]
collection = db["mycollection"]

with open("jsondata.json", "r") as f:
    data = json.load(f)

result = collection.insert_many(data)