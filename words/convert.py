import pdfplumber
import pandas as pd
import re

# Load the PDF
pdf_path = "7000.pdf"
with pdfplumber.open(pdf_path) as pdf:
    text = ""
    for page in pdf.pages:
        text += page.extract_text()

print(text[:100])
# text = text[:20]


pattern = r"([a-zA-Z/]+(?:\s*\(\d+\))?)\s+\[.*?\]\s+.*?\.\s+(.+)"
matches = re.findall(pattern, text)

print(matches[0])
# Convert matches into a DataFrame for better handling and saving
df = pd.DataFrame(matches, columns=["English Word", "Chinese Meaning"])

# Save to Excel for easy access
df.to_excel("words.xlsx", index=False)

# Print to verify output
# print(df)