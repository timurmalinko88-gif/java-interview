import os
import glob
import re

def normalize_fm():
    md_files = glob.glob(r"c:\java-prep\public\questions\**\*.md", recursive=True)
    
    for filepath in md_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        lines = content.split('\n')
        if not lines:
            continue
            
        has_explicit = lines[0].strip() == '---'
        
        has_prerequisites = False
        fm_end_idx = 0
        
        if has_explicit:
            for i in range(1, len(lines)):
                if lines[i].strip() == '---':
                    fm_end_idx = i
                    break
                if re.match(r'^prerequisites\s*:', lines[i].strip(), re.IGNORECASE):
                    has_prerequisites = True
        else:
            for i in range(len(lines)):
                if not lines[i].strip() or lines[i].startswith('#'):
                    fm_end_idx = i
                    break
                if re.match(r'^prerequisites\s*:', lines[i].strip(), re.IGNORECASE):
                    has_prerequisites = True
                    
        for i in range(len(lines)):
            # process frontmatter lines
            if (has_explicit and i > 0 and i < fm_end_idx) or (not has_explicit and i < fm_end_idx):
                line = lines[i]
                
                # Check for estimated_time_minutes
                m = re.match(r'^(estimated_time_minutes)(\s*:.*)$', line, re.IGNORECASE)
                if m:
                    line = 'time' + m.group(2)
                    
                # Check for frequency
                m = re.match(r'^(frequency\s*:\s*)(.*)$', line, re.IGNORECASE)
                if m:
                    val = m.group(2).strip().strip("'").strip('"')
                    if val.lower() == 'high':
                        line = m.group(1) + "90%"
                    elif val.lower() == 'medium':
                        line = m.group(1) + "60%"
                    elif val.lower() == 'low':
                        line = m.group(1) + "30%"
                    
                # Check for related_questions
                m = re.match(r'^(related_questions)(\s*:.*)$', line, re.IGNORECASE)
                if m:
                    if not has_prerequisites:
                        line = 'prerequisites' + m.group(2)
                        has_prerequisites = True
                        
                lines[i] = line
                
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))

if __name__ == '__main__':
    normalize_fm()
