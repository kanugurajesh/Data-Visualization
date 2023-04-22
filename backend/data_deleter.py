import pymongo

# establish a connection to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")

# select the database
db = client["mydatabase"]

# select the collection
collection = db["mycollection"]

# delete all documents in the collection
collection.delete_many({})
