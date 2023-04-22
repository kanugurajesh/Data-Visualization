import pymongo
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS, cross_origin
# from bson import ObjectId
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
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


@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')
# @app.route('/data')
# @cross_origin()
# def example():
#     # return a list of all the documents in the collection
#     return jsonify(documents)


@app.route('/key_data')
@cross_origin()
def hello():
    return jsonify(list(key))


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

    if option == "month":
        string_data = "%Y-%m"
    elif option == "year":
        string_data = "%Y"
    elif option == "day":
        string_data = "%Y-%m-%d"

    query = {}
    queries = []

    for elem in result:
        key, value = elem.split(":", 1)
        query[key] = value
        queries.append(query)
        query = {}

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

    result_string = {}

    relevance = 0
    impact = 0
    intensity = 0
    likelihood = 0
    count = 0

    sender = {}

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


# run the app
if __name__ == '__main__':
    app.run(debug=True)
