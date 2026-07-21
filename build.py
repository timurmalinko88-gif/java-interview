# coding=utf-8
"""
Обновленный скрипт сборки: интеллектуально парсит метаданные Markdown-файлов
как с использованием разделителей '---', так и без них (напрямую с первой строки).
"""

import os
import json
import glob
import re

def build_index():
    """Сканирует папку questions/ и создаёт index.json"""
    questions = []
    # Ищем файлы .md в папке questions и во всех подпапках
    md_files = sorted(glob.glob('questions/**/*.md', recursive=True))

    print(f"Найдено файлов: {len(md_files)}")

    for filepath in md_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        metadata = {}
        has_explicit_frontmatter = False
        
        # Проверяем, есть ли явные разделители YAML-frontmatter '---'
        if lines:
            first_line = lines[0].strip()
            if first_line == '---':
                has_explicit_frontmatter = True

        if has_explicit_frontmatter:
            # Логика для файлов с разделителями '---'
            in_frontmatter = False
            for line in lines:
                line_str = line.strip()
                if line_str == '---':
                    if not in_frontmatter:
                        in_frontmatter = True
                        continue
                    else:
                        break
                if in_frontmatter:
                    meta_match = re.match(r'^([a-zA-Z0-9_-]+)\s*:\s*(.*)$', line_str)
                    if meta_match:
                        key = meta_match.group(1).lower()
                        value = meta_match.group(2).strip().strip('"').strip("'")
                        if value.startswith('[') and value.endswith(']'):
                            value = [v.strip().strip('"').strip("'") for v in value[1:-1].split(',') if v.strip()]
                        metadata[key] = value
        else:
            # Логика для файлов без разделителей (чтение сплошного блока "ключ: значение" сверху)
            for line in lines:
                line_str = line.strip()
                if not line_str:
                    break  # Пустая строка означает конец блока метаданных
                
                meta_match = re.match(r'^([a-zA-Z0-9_-]+)\s*:\s*(.*)$', line_str)
                if meta_match:
                    key = meta_match.group(1).lower()
                    value = meta_match.group(2).strip().strip('"').strip("'")
                    if value.startswith('[') and value.endswith(']'):
                        value = [v.strip().strip('"').strip("'") for v in value[1:-1].split(',') if v.strip()]
                    metadata[key] = value
                else:
                    break  # Если строка не похожа на "ключ: значение", метаданные закончились

        # Относительный путь для фронтенда
        rel_path = filepath.replace('\\', '/')

        # Извлекаем тело документа (после frontmatter)
        body_lines = []
        dash_count = 0
        if has_explicit_frontmatter:
            for line in lines:
                if line.strip() == '---':
                    dash_count += 1
                    continue
                if dash_count >= 2:
                    body_lines.append(line)
        else:
            in_body = False
            for line in lines:
                line_str = line.strip()
                if not line_str:
                    in_body = True
                    continue
                if in_body:
                    body_lines.append(line)

        # Попытка автоматически извлечь красивый заголовок вопроса для списка
        title = metadata.get('title', '')
        if not title:
            for line in body_lines:
                line_str = line.strip()
                if line_str.startswith('#'):
                    title = line_str.lstrip('#').strip()
                    break
                elif line_str and not line_str.startswith('```') and not line_str.startswith('---'):
                    title = line_str
                    break

        question_id = metadata.get('id', os.path.splitext(os.path.basename(filepath))[0])
        topic = metadata.get('topic', 'General')
        if question_id.startswith('jvm-'):
            topic = 'JVM & Memory Management'
        elif question_id.startswith('oop-') or question_id in {'q1'}:
            topic = 'OOP'
        elif question_id.startswith('multithreading-') or question_id in {'q2'}:
            topic = 'Multithreading'
        elif question_id.startswith('collections-'):
            topic = 'Collections'
        elif question_id.startswith('stream-'):
            topic = 'Stream API'
        elif question_id.startswith('spring-'):
            topic = 'Spring'
        elif question_id.startswith('databases-'):
            topic = 'Databases'
        elif question_id.startswith('system-design-') or question_id in {'q3'}:
            topic = 'System Design'
        elif question_id.startswith('patterns-'):
            topic = 'Patterns'
        elif question_id.startswith('testing-'):
            topic = 'Testing'

        questions.append({
            'id': question_id,
            'path': rel_path,
            'topic': topic,
            'difficulty': metadata.get('difficulty', metadata.get('level', 'Junior')),
            'format': metadata.get('format', 'Open Answer'),
            'title': title if title else os.path.splitext(os.path.basename(filepath))[0],
            'time': metadata.get('estimated_time_minutes', ''),
            'frequency': metadata.get('frequency', ''),
            'related': metadata.get('related_questions', [])
        })

    # Сохраняем итоговый индекс
    index = {
        'version': '1.0',
        'total': len(questions),
        'questions': questions
    }

    with open('index.json', 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"\nУспешно! Обновлен index.json. Проиндексировано файлов: {len(questions)}")

if __name__ == '__main__':
    build_index()
