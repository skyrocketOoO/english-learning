import json
import random
from collections import defaultdict

with open('total_words.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    
merged_dict = defaultdict(set)

# Iterate over each entry and merge translations for duplicates
for entry in data:
    key = (entry["word"], entry["part_of_speech"])  # Unique key
    merged_dict[key].update(entry["translate"].split(";"))  # Split by ";"

# Convert merged dictionary back to list format
merged_data = [
    {"word": word, "part_of_speech": pos, "translate": ";".join(sorted(translations))}
    for (word, pos), translations in merged_dict.items()
]

print(len(merged_data))
  
with open('total_words.json', 'w', encoding='utf-8') as file:
    json.dump(merged_data, file, indent=2, ensure_ascii=False)