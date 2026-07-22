import glob
import re

files = glob.glob(r'c:\java-prep\questions\**\*.md', recursive=True)

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Find all occurrences of ---ANSWER---
    # We want to keep only the first one.
    parts = text.split('---ANSWER---')
    if len(parts) > 2:
        # Rejoin using the first part as question, and the rest as answer
        new_text = parts[0] + "---ANSWER---" + "".join(parts[1:])
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print(f"Fixed duplicate ANSWER in {path}")
