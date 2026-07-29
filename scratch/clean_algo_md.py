import glob
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    cleaned = content
    cleaned = cleaned.replace(r'$\rightarrow$', '→')
    cleaned = cleaned.replace(r'\rightarrow', '→')
    cleaned = cleaned.replace(r'$\implies$', '⇒')
    cleaned = cleaned.replace(r'\implies', '⇒')
    cleaned = cleaned.replace(r'$\le$', '≤')
    cleaned = cleaned.replace(r'$\ge$', '≥')
    cleaned = re.sub(r'\$O\(([^)]+)\)\$', r'O(\1)', cleaned)
    
    # Remove trailing --- at end of answer sections
    cleaned = re.sub(r'\n---\n\n###', '\n\n###', cleaned)

    if cleaned != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        print(f"Cleaned: {filepath}")

for filepath in glob.glob('public/questions/algorithms/*.md'):
    clean_file(filepath)
