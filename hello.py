import pymongo
from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# establish a connection to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")

# get a reference to the database
db = client["mydatabase"]

# get a reference to the collection
collection = db["mycollection"]

doc = collection.find_one({})

keys = list(doc.keys())

docs = keys[1]

print("the doc value is ", docs)

my_set = set()

vijay = collection.find({})

for i in vijay:
    my_set.add(i[docs])

print(my_set)