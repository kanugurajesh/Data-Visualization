from pymongo import MongoClient
from datetime import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client['mydatabase']
collection = db['mycollection']

pipeline = [
    {
        '$group': {
            '_id': {
                '$dateToString': {
                    # 'format': '%Y-%m-%d %z',
                    'format':'%Y-%m',
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

results = collection.aggregate(pipeline)

for result in results:
    print(result['_id'], result['count'])
    # print(result['_id'], result['count'],"\n\n\n\n", result['documents'])
    # for i in result['_id']:
    #     print(i)
    break
