import re

with open('c:/java-prep/build.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the bad indentation
bad_indent = """                    key = meta_match.group(1).lower()
                    value = meta_match.group(2).strip().strip('"').strip("'")
                        if value.startswith('[') and value.endswith(']'):
                            value = [v.strip().strip('"').strip("'") for v in value[1:-1].split(',') if v.strip()]
                        elif key in ('tags', 'related_questions', 'related'):
                            value = [v.strip().strip('"').strip("'") for v in value.split(',') if v.strip()]
                        metadata[key] = value"""

good_indent = """                    key = meta_match.group(1).lower()
                    value = meta_match.group(2).strip().strip('"').strip("'")
                    if value.startswith('[') and value.endswith(']'):
                        value = [v.strip().strip('"').strip("'") for v in value[1:-1].split(',') if v.strip()]
                    elif key in ('tags', 'related_questions', 'related'):
                        value = [v.strip().strip('"').strip("'") for v in value.split(',') if v.strip()]
                    metadata[key] = value"""

text = text.replace(bad_indent, good_indent)

with open('c:/java-prep/build.py', 'w', encoding='utf-8') as f:
    f.write(text)
