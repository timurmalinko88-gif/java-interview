import glob
import re
import os

files = glob.glob(r'c:\java-prep\questions\**\*.md', recursive=True)

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Normalize headings
    text = re.sub(r'^#+.*Analogy.*$', '### Life Analogy', text, flags=re.MULTILINE|re.IGNORECASE)
    text = re.sub(r'^#+.*Key Point.*$', '### Key Points', text, flags=re.MULTILINE|re.IGNORECASE)

    # Now that headings are normalized, we need to extract them and put them at the end.
    # To do this safely, we will find `### Life Analogy` and `### Key Points` blocks.
    # A block starts with the heading and goes until the NEXT heading (`^#`) or `---ANSWER---` or EOF.
    # But wait, what if Key Points has `1. **Heap vs Metaspace:**` which is not a heading? Yes, that's fine.
    # Wait, what if there are internal headings inside Analogy or Key Points? Usually not.

    def extract_block(header, txt):
        pattern = f"^({header}\\s*\\n)(.*?)(?=\\n^#|\\n---ANSWER---|$)"
        match = re.search(pattern, txt, flags=re.MULTILINE | re.DOTALL)
        if match:
            # We found the block
            return match.group(0), txt.replace(match.group(0), '')
        return "", txt

    analogy_block, text = extract_block(r'### Life Analogy', text)
    kp_block, text = extract_block(r'### Key Points', text)

    # Now append them to the end of the file.
    if analogy_block or kp_block:
        # Strip trailing whitespace from the main text
        text = text.rstrip() + "\n\n"
        if analogy_block:
            text += analogy_block.strip() + "\n\n"
        if kp_block:
            text += kp_block.strip() + "\n"

    # Remove any floating `---` that are not frontmatter
    fm_match = re.search(r'^---\n.*?\n---\n', text, re.DOTALL)
    if fm_match:
        fm = fm_match.group(0)
        body = text[len(fm):]
        # Remove floating ---
        body = re.sub(r'^\s*---\s*$', '', body, flags=re.MULTILINE)
        # Clean up triple newlines
        body = re.sub(r'\n{3,}', '\n\n', body)
        new_text = fm + body
    else:
        new_text = text

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)

print("Formatting standardization complete.")
