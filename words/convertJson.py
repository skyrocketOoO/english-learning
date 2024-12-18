import json

# Load JSON data from the file
with open('words-advance.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Function to extract part of speech from the word field
def extract_pos(entry):
    # Split the word field to get the part in parentheses
    if '(' in entry["word"] and ')' in entry["word"]:
        pos = entry["word"].split('(')[1].split(')')[0]
        entry["part_of_speech"] = pos  # Append to the entry
        entry["word"] = entry["word"].split(' (')[0]  # Remove the POS from word field
    return entry

# Process the data
processed_data = [extract_pos(entry) for entry in data]

# Save the updated data back to the file
with open('words-advance_updated.json', 'w', encoding='utf-8') as file:
    json.dump(processed_data, file, indent=2, ensure_ascii=False)

# Output the processed data (optional)
# print(json.dumps(processed_data, indent=2, ensure_ascii=False))
