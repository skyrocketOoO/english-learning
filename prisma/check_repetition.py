import json
import random
from collections import defaultdict

with open('total_words.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    
merged_dict = defaultdict(list)

# Iterate over each entry and merge translations for duplicates
for entry in data:
    key = (entry["word"], entry["part_of_speech"])  # Unique key
    merged_dict[key].append(entry["translate"])

# Convert merged dictionary back to list format
merged_data = [
    {"word": word, "part_of_speech": pos, "translate": "; ".join(translations)}
    for (word, pos), translations in merged_dict.items()
]

# Print the result
# print(json.dumps(merged_data, ensure_ascii=False, indent=2))
  
with open('total_words.json', 'w', encoding='utf-8') as file:
    json.dump(merged_data, file, indent=2, ensure_ascii=False)