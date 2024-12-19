import json
import random

with open('total_words.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    
random.shuffle(data)

with open('total_words.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, indent=2, ensure_ascii=False)