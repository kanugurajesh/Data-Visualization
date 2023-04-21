from pymongo import MongoClient
from datetime import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client['mydatabase']
collection = db['mycollection']

# pipeline = [
#     {
#         # adding the match
#         '$group': {
#             '_id': {
#                 '$dateToString': {
#                     # 'format': '%Y-%m-%d %z',
#                     'format': '%Y-%m',
#                     'date': {
#                         '$toDate': {
#                             '$multiply': ['$epoch', 1000]
#                         }
#                     }
#                 }
#             },
#             'count': {'$sum': 1},
#             'documents': {'$push': '$$ROOT'}
#         }
#     }
# ]

queries = [{"country":"India"},{"pestle": "Industries"}]

# pipeline = [
#     # Filter documents that match any of the queries
#     # {'$match': {"country":"India"}},
#     {'$match': {"$and": queries}},
#     # Group documents by year and month
#     {
#         '$group': {
#             '_id': {
#                 '$dateToString': {
#                     'format': '%Y-%m',
#                     'date': {
#                         '$toDate': {
#                             '$multiply': ['$epoch', 1000]
#                         }
#                     }
#                 }
#             },
#             'count': {'$sum': 1},
#             'documents': {'$push': '$$ROOT'}
#         }
#     }
# ]

pipeline = [{'$match': {'$and': [{'country': 'United States of America'}]}}, {'$group': {'_id': {'$dateToString': {'format': '%Y-%m-%d', 'date': {'$toDate': {'$multiply': ['$epoch', 1000]}}}}, 'count': {'$sum': 1}, 'documents': {'$push': '$$ROOT'}}}]

results = collection.aggregate(pipeline)

# count = collection.count_documents({"country": "India"})
# print(count)

for result in results:
    # print(result['_id'], result['count'])
    print(result)
    break