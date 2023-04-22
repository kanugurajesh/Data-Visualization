# importing the necessary dependencies
import json
from datetime import datetime

# open the json file
with open('jsondata.json') as f:
    data = json.load(f)

# convert the date string to epoch time
for item in data:
    date_string = item["added"]
    if(item["relevance"]==""):
        item["relevance"] = 0
    if(item["impact"]==""):
        item["impact"] = 0
    if(item["intensity"]==""):
        item["intensity"] = 0
    if(item["likelihood"]==""):
        item["likelihood"] = 0
    datetime_obj = datetime.strptime(date_string, "%B, %d %Y %H:%M:%S")
    epoch_time = int(datetime_obj.timestamp())
    item["epoch"] = epoch_time

# write the data to the json file
with open('jsondata.json', 'w') as f:
    json.dump(data, f)