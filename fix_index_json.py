import json
import os

filepath = 'public/index.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
for q in data.get('questions', []):
    diff = q.get('difficulty')
    if diff == 'Hard' or diff == 'High' or diff == '"Senior"':
        q['difficulty'] = 'Senior'
        count += 1
    elif diff == 'Easy' or diff == '"Junior"':
        q['difficulty'] = 'Junior'
        count += 1
    elif diff == 'General' or diff == '"Middle"':
        q['difficulty'] = 'Middle'
        count += 1

if count > 0:
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f'Updated {count} records in index.json.')
else:
    print('No records needed updating in index.json.')
