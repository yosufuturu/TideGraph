import json


with open('new.json') as f:
    data = json.load(f)

    for x in data['list']:
        for y in x:
            print(x[y])