import glob
import os
import re
import subprocess

files = glob.glob(r'c:\java-prep\questions\**\*.md', recursive=True)
wiped_files = []

for path in files:
    if os.path.getsize(path) == 0:
        wiped_files.append(path)

print(f"Wiped files to restore: {len(wiped_files)}")

# 1. Restore wiped files from the good commit
for path in wiped_files:
    # Get the relative path for git
    rel_path = os.path.relpath(path, r'c:\java-prep').replace('\\', '/')
    subprocess.run(['git', 'checkout', '4dfa357', '--', rel_path], cwd=r'c:\java-prep')
    print(f"Restored {rel_path} from 4dfa357")

# 2. Fix the floating `---` in all files
# We only want to remove `---` if it's on a line by itself, and NOT part of the YAML frontmatter.
# YAML frontmatter is the first `---` and the second `---` at the top of the file.
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Let's split off the frontmatter safely
    fm_match = re.search(r'^---\n.*?\n---\n', text, re.DOTALL)
    if not fm_match:
        continue
    
    frontmatter = fm_match.group(0)
    body = text[len(frontmatter):]
    
    # In the body, we should not have ANY `---` on a line by itself EXCEPT `---ANSWER---`
    # Wait, some people might use `---` for horizontal rules intentionally in the answer.
    # But earlier I said "the lines on the frontend" meaning `---` is leaking into the UI.
    # The UI parser splits by `---ANSWER---`. We just need to remove any standalone `---` that is NOT `---ANSWER---`.
    
    # We will remove `---` at the beginning of a line that has no other text.
    new_body = re.sub(r'^\s*---\s*$', '', body, flags=re.MULTILINE)
    
    # Also remove duplicate newlines
    new_body = re.sub(r'\n{3,}', '\n\n', new_body)
    
    new_text = frontmatter + new_body
    
    if new_text != text:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print(f"Removed floating --- in {os.path.basename(path)}")

