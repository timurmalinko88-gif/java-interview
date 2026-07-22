import os
import glob
import re

def parse_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Извлечь метаданные
    metadata = {}
    clean_text = content
    
    # Ищем блок --- yaml ---
    yaml_match = re.search(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if yaml_match:
        yaml_text = yaml_match.group(1)
        clean_text = content[yaml_match.end():].strip()
        for line in yaml_text.split('\n'):
            line = line.strip()
            if not line: continue
            m = re.match(r'^([a-zA-Z0-9_-]+)\s*:\s*(.*)$', line)
            if m:
                key, val = m.group(1).strip().lower(), m.group(2).strip()
                metadata[key] = val
    else:
        # Если нет ---, читаем построчно сверху
        lines = content.split('\n')
        idx = 0
        while idx < len(lines):
            line = lines[idx].strip()
            if not line:
                break
            m = re.match(r'^([a-zA-Z0-9_-]+)\s*:\s*(.*)$', line)
            if m:
                key, val = m.group(1).strip().lower(), m.group(2).strip()
                metadata[key] = val
                idx += 1
            else:
                break
        clean_text = '\n'.join(lines[idx:]).strip()

    # 2. Разделить на вопрос и ответ
    section_pattern = r'(?:^|\n)\s*(?:#{1,3}\s*)?(Answer|Answer Structure|Structured Answer|Good Answer Structure|What a Good Answer Covers|Key Points.*?|Example Solution|Ответ|Разбор|Аналогия)\s*\n'
    match = re.search(section_pattern, clean_text, re.IGNORECASE)
    
    if match:
        question_text = clean_text[:match.start()].strip()
        answer_text = clean_text[match.end():].strip()
    else:
        question_text = clean_text
        answer_text = ""

    # Подчищаем заголовки Question/Вопрос
    q_match = re.search(r'(?:^|\n)\s*(?:#{1,3}\s*)?(Question|Вопрос)\s*\n', question_text, re.IGNORECASE)
    if q_match:
        question_text = question_text[:q_match.start()] + "\n" + question_text[q_match.end():]
        question_text = question_text.strip()

    return metadata, question_text, answer_text

def format_metadata_block(metadata):
    lines = ["---"]
    order = ["id", "title", "topic", "difficulty", "format", "estimated_time_minutes", "frequency", "related_questions", "source"]
    for k in order:
        if k in metadata:
            lines.append(f"{k}: {metadata[k]}")
    for k, v in metadata.items():
        if k not in order:
            lines.append(f"{k}: {v}")
    lines.append("---")
    return "\n".join(lines)

def main():
    base_dir = r"c:\java-prep\questions"
    files = glob.glob(os.path.join(base_dir, "*.md"))
    
    print(f"Found {len(files)} files to format.")
    
    for filepath in files:
        if not os.path.isfile(filepath): continue
        filename = os.path.basename(filepath)
        
        metadata, q_text, a_text = parse_file(filepath)
        
        # Определяем папку
        topic_raw = metadata.get('topic', 'General').strip()
        topic_slug = re.sub(r'[^a-zA-Z0-9]+', '-', topic_raw).strip('-').lower()
        if not topic_slug:
            topic_slug = 'general'
            
        target_dir = os.path.join(base_dir, topic_slug)
        os.makedirs(target_dir, exist_ok=True)
        
        target_file = os.path.join(target_dir, filename)
        
        # Собираем новый контент
        new_content = format_metadata_block(metadata) + "\n\n" + q_text
        if a_text:
            new_content += "\n\n---ANSWER---\n\n" + a_text
            
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        # Удаляем старый файл если путь изменился
        if filepath != target_file:
            os.remove(filepath)
            
    print("Formatting complete!")

if __name__ == "__main__":
    main()
