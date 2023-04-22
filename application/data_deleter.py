# This file is used to delete data from the mongodb database.

# importing the necessary dependencies
import pymongo
import docker

# enable docker
client = docker.from_env()

# get the container name from the file
with open("../value.txt", "r") as f:
    container_name = f.read()

# Replace "container_name" with the name of your container
container = client.containers.get(container_name)

if container.status != "running":
    container.start()
    print("Container started")
else:
    print("Container already running")

# establish a connection to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")

# select the database
db = client["mydatabase"]

# select the collection
collection = db["mycollection"]

# delete all documents in the collection
collection.delete_many({})
