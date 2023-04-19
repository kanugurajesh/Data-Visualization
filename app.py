import pymongo
from flask import Flask, jsonify, render_template,request
from flask_cors import CORS, cross_origin
from bson import ObjectId
import json

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

key = documents[0].keys()

# retrive a single document from the collection

# convert ObjectId values to strings
for doc in documents:
    doc["_id"] = str(doc["_id"])

@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')

# send the keys to the client
@app.route('/key_data')
@cross_origin()
def hello():
    return jsonify(list(key))

@app.route('/data', methods=['POST'])
@cross_origin()
def example():
    values = set()
    results = request.get_json()
    result = results["selectedValue"]
    # print the length of the documents
    for doc in documents:
        if result in doc:
            values.add(doc[result])
    return jsonify(list(values))

# run the app
if __name__ == '__main__':
    app.run(debug=True)
