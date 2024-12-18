import json

# Load JSON data from the file
with open('words_updated.json', 'r', encoding='utf-8') as file:
    data1 = json.load(file)
    
with open('words-advance_updated.json', 'r', encoding='utf-8') as file:
    data2 = json.load(file)
    
data1 += data2

with open('total_words.json', 'w', encoding='utf-8') as file:
    json.dump(data1, file, indent=2, ensure_ascii=False)