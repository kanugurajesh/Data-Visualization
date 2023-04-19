import pymongo
from flask import Flask, jsonify, render_template
from flask_cors import CORS, cross_origin
from bson import ObjectId

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# establish a connection to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")

# get a reference to the database
db = client["mydatabase"]

# get a reference to the collection
collection = db["mycollection"]

# retrieve all documents from the collection
documents = list(collection.find({"sector":"Energy"}))

# retrive a single document from the collection


# convert ObjectId values to strings
for doc in documents:
    doc["_id"] = str(doc["_id"])

@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')

@app.route('/data')
@cross_origin()
def example():
    # return a list of all the documents in the collection
    return jsonify(documents)

# run the app
if __name__ == '__main__':
    app.run(debug=True)