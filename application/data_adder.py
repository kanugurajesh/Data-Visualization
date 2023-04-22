# This file is used to add data to the mongodb database.

# importing the necessary dependencies
import pymongo
import json
import docker

# enable docker
client = docker.from_env()

# get the container name from the file
with open("../value.txt", "r") as f:
    container_name = f.read()

# Replace "container_name" with the name of your container
container = client.containers.get(container_name)

# start the container if it is not running
if container.status != "running":
    container.start()
    print("Container started")
else:
    print("Container already running")


# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]
collection = db["mycollection"]

# Load JSON data from file
with open("jsondata.json") as f:
    data = json.load(f)

# Insert JSON data into collection
collection.insert_many(data)
