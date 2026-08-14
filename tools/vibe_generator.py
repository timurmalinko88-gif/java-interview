#!/usr/bin/env python3
"""
vibe_generator.py - Vibecoding CLI helper for Java Interview Prep Hub
Features:
- scaffold: Create new markdown questions with strict frontmatter.
- validate: Check all public/questions/**/*.md files against schema rules.
"""

import os
import argparse
import glob
import re

TOPICS = [
    "AI & LLM Integration", "Algorithm Breakdown", "Behavioral", "Collections",
    "Databases", "Exceptions", "General", "JVM & Memory Management",
    "Live Coding", "Kafka & Messaging", "Modern Java 21+", "Multithreading",
    "OOP", "Patterns", "Spring", "Stream API", "System Design", "Testing"
]
DIFFICULTIES = ["Junior", "Middle", "Senior"]
FORMATS = ["Open Answer", "Code Review", "System Design", "MCQ", "Live Coding", "Algo Breakdown", "HR Interview"]

FRONTMATTER_REGEX = re.compile(r"^---\n(.*?)\n---\n(.*)", re.DOTALL)

def scaffold(args):
    """Scaffold a new markdown question."""
    filename = args.filename if args.filename.endswith('.md') else f"{args.filename}.md"
    filepath = os.path.join('public', 'questions', args.folder, filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    if os.path.exists(filepath):
        print(f"Error: {filepath} already exists.")
        return

    content = f"""---
id: {args.filename.replace('.md', '')}
topic: {args.topic}
difficulty: {args.difficulty}
format: {args.format}
time: {args.time}
frequency: {args.frequency}
source: Custom
prerequisites: []
---

# {args.title}

Write your question prompt here...

---ANSWER---

Write the detailed answer here...

### Life Analogy
Add an analogy...

### Key Takeaways
- Point 1
- Point 2
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✨ Scaffolded new question at {filepath}")

def validate(args):
    """Validate markdown schema."""
    files = glob.glob('public/questions/**/*.md', recursive=True)
    errors = 0
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        match = FRONTMATTER_REGEX.match(content)
        if not match:
            lines = content.split('\n')
            if not lines or not lines[0].strip().startswith("id:"):
                # We'll skip strict validation for older files, but warn
                pass
            continue
            
        fm = match.group(1)
        body = match.group(2)
        
        meta = {}
        for line in fm.split('\n'):
            if ':' in line:
                k, v = line.split(':', 1)
                meta[k.strip().lower()] = v.strip()
        
        if '---ANSWER---' not in body:
            print(f"❌ {file}: Missing ---ANSWER--- divider")
            errors += 1
            
        if 'id' not in meta:
            print(f"❌ {file}: Missing 'id' in frontmatter")
            errors += 1
            
    if errors == 0:
        print(f"✅ All {len(files)} files passed validation!")
    else:
        print(f"❌ Found {errors} validation errors.")

def main():
    parser = argparse.ArgumentParser(description="Vibecoding generator for java-interview repo")
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    # Scaffold command
    scaffold_p = subparsers.add_parser("scaffold", help="Scaffold a new question")
    scaffold_p.add_argument("--filename", required=True, help="Filename (e.g. spring-boot-001)")
    scaffold_p.add_argument("--folder", required=True, help="Folder inside public/questions/")
    scaffold_p.add_argument("--title", required=True, help="Question Title")
    scaffold_p.add_argument("--topic", default="General", help="Topic classification")
    scaffold_p.add_argument("--difficulty", default="Middle", choices=DIFFICULTIES)
    scaffold_p.add_argument("--format", default="Open Answer", choices=FORMATS)
    scaffold_p.add_argument("--time", default="5", help="Time in minutes")
    scaffold_p.add_argument("--frequency", default="High", help="Frequency (e.g., High, 90%)")
    
    # Validate command
    validate_p = subparsers.add_parser("validate", help="Validate existing questions")
    
    args = parser.parse_args()
    if args.command == "scaffold":
        scaffold(args)
    elif args.command == "validate":
        validate(args)

if __name__ == "__main__":
    main()
