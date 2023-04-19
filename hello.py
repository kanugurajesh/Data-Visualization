import pymongo

# establish a connection to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")

# get a reference to the database
db = client["mydatabase"]

# get a reference to the collection
collection = db["mycollection"]

# retrieve all documents from the collection
documents = list(collection.find({}))

keys = documents[0].keys()

print(keys)