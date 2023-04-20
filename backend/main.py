import json
from datetime import datetime

with open('jsondata.json') as f:
    data = json.load(f)

for item in data:
    date_string = item["added"]
    datetime_obj = datetime.strptime(date_string, "%B, %d %Y %H:%M:%S")
    epoch_time = int(datetime_obj.timestamp())
    item["epoch"] = epoch_time

with open('jsondata.json', 'w') as f:
    json.dump(data, f)