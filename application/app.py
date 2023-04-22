# This is the main file that contains the Flask application

# importing the necessary dependencies
import pymongo
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS, cross_origin
import docker

# create an instance of Flask
app = Flask(__name__)
# enable CORS
cors = CORS(app, resources={r"/*": {"origins": "*"}})
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

# establish a connection to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
# get a reference to the database
db = client["mydatabase"]
# get a reference to the collection
collection = db["mycollection"]
# retrieve all documents from the collection
documents = list(collection.find({}))
# retrive a single document from the collection
key = documents[0].keys()
# convert ObjectId values to strings
for doc in documents:
    doc["_id"] = str(doc["_id"])


# define a route that returns the index.html file
@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')

# define a route that returns the key data


@app.route('/key_data')
@cross_origin()
def hello():
    return jsonify(list(key))


# define a route that returns the documents data
@app.route('/data', methods=['POST', 'GET'])
@cross_origin()
def examples():
    values = set()
    results = request.get_json()
    result = results["selectedValue"]
    # print the length of the documents
    for doc in documents:
        if result in doc:
            values.add(doc[result])
    return jsonify(list(values))


@app.route('/submit', methods=['POST'])
@cross_origin()
def submited():
    results = request.get_json()
    result = results["data"]
    option = results["option"]
    string_data = ""

    # assigning the variables
    if option == "month":
        string_data = "%Y-%m"
    elif option == "year":
        string_data = "%Y"
    elif option == "day":
        string_data = "%Y-%m-%d"

    # declaring the variables
    query = {}
    queries = []

    # splitting the data
    for elem in result:
        key, value = elem.split(":", 1)
        query[key] = value
        queries.append(query)
        query = {}

        # declaring the pipeline to aggregate the data
        pipeline = [
            {'$match': {"$and": queries}},
            {
                '$group': {
                    '_id': {
                        '$dateToString': {
                            'format': string_data,
                            'date': {
                                '$toDate': {
                                    '$multiply': ['$epoch', 1000]
                                }
                            }
                        }
                    },
                    'count': {'$sum': 1},
                    'documents': {'$push': '$$ROOT'}
                }
            }
        ]

    # initializing the variables to zero and empty
    result_string = {}

    relevance = 0
    impact = 0
    intensity = 0
    likelihood = 0
    count = 0

    sender = {}

    # iterating through the data
    for sales in collection.aggregate(pipeline):
        print(sales)
        for doc in sales["documents"]:
            relevance += doc["relevance"]
            impact += doc["impact"]
            intensity += doc["intensity"]
            likelihood += doc["likelihood"]
            country = doc["country"]

        count = sales["count"]
        sender["relevance"] = int(relevance/count)
        sender["impact"] = int(impact/count)
        sender["intensity"] = int(intensity/count)
        sender["likelihood"] = int(likelihood/count)
        sender["count"] = count
        sender["date"] = sales["_id"]
        sender["country"] = country
        result_string[sales["_id"]] = sender
        sender = {}
        relevance = 0
        impact = 0
        intensity = 0
        likelihood = 0
        count = 0

    # print(sender,99)
    print(result_string)
    return result_string


# run the app in debug mode
if __name__ == '__main__':
    app.run(debug=True)
