import os
import re

directory = r'public/questions'

replacements = {
    r'^difficulty:\s*Hard\s*$': 'difficulty: Senior',
    r'^difficulty:\s*Easy\s*$': 'difficulty: Junior',
    r'^difficulty:\s*High\s*$': 'difficulty: Senior',
    r'^difficulty:\s*General\s*$': 'difficulty: Middle',
    r'^difficulty:\s*"Junior"\s*$': 'difficulty: Junior',
    r'^difficulty:\s*"Middle"\s*$': 'difficulty: Middle',
    r'^difficulty:\s*"Senior"\s*$': 'difficulty: Senior',
}

count = 0
for root, _, files in os.walk(directory):
    for filename in files:
        if filename.endswith('.md'):
            filepath = os.path.join(root, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, repl in replacements.items():
                new_content = re.sub(pattern, repl, new_content, flags=re.MULTILINE)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                
print(f'Updated {count} files.')
