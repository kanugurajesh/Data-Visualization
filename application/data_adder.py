import pymongo
import json

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]
collection = db["mycollection"]

# Load JSON data from file
with open("jsondata.json") as f:
    data = json.load(f)

# Insert JSON data into collection
collection.insert_many(data)
