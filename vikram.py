import pymongo
import json

# Connect to MongoDB inside the Docker container
client = pymongo.MongoClient("mongodb://localhost:27017/")

# Insert data into MongoDB collection
db = client["mydatabase"]
collection = db["mycollection"]
# collection.insert_many(data)

# Print the number of documents in the collection
# print(f"{collection.count_documents({})} documents in collection")

results = collection.find_one({})

for key, value in results.items():
    print(key,type(value))