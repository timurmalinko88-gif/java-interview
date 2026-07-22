import glob
import re
import os

files = glob.glob(r'c:\java-prep\questions\**\*.md', recursive=True)

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # 1. Normalize headers
    text = re.sub(r'^##\s+Life Analogy', '### Life Analogy', text, flags=re.MULTILINE|re.IGNORECASE)
    text = re.sub(r'^##\s+Key Points', '### Key Points', text, flags=re.MULTILINE|re.IGNORECASE)

    # 2. Extract Analogy and Key Points blocks if they exist anywhere
    analogy_match = re.search(r'(###\s+Life Analogy\s*\n.*?)(?=###\s+Key Points|---ANSWER---|$)', text, flags=re.DOTALL)
    kp_match = re.search(r'(###\s+Key Points\s*\n.*?)(?=###\s+Life Analogy|---ANSWER---|$)', text, flags=re.DOTALL)

    analogy_text = analogy_match.group(1).strip() if analogy_match else ""
    kp_text = kp_match.group(1).strip() if kp_match else ""

    # 3. Remove them from the original text
    if analogy_match:
        text = text.replace(analogy_match.group(1), '')
    if kp_match:
        text = text.replace(kp_match.group(1), '')

    # 4. Clean up any floating `---` that might have been left around them
    text = re.sub(r'\n---\n(?=\n*---ANSWER---)', '\n', text)
    text = re.sub(r'\n---\n(?=\n*$)', '\n', text)

    # 5. Append them at the very end of the file
    new_text = text.strip() + "\n\n"
    if analogy_text:
        new_text += analogy_text + "\n\n"
    if kp_text:
        new_text += kp_text + "\n"

    if new_text != text:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print(f"Fixed {path}")
