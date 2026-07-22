import os
import glob
import re

TAG_RULES = {
    'oop': ['oop', 'ооп', 'инкапсуляци', 'наследовани', 'полиморфизм', 'абстракци', 'класс', 'объект', 'интерфейс', 'interface', 'class', 'object'],
    'collections': ['collection', 'коллекци', 'list', 'set', 'map', 'arraylist', 'linkedlist', 'hashmap', 'hashtable', 'treemap', 'hashset', 'queue', 'deque'],
    'multithreading': ['thread', 'поток', 'runnable', 'callable', 'executor', 'synchroniz', 'синхронизаци', 'volatile', 'deadlock', 'lock', 'atomic', 'concurrent', 'wait', 'notify', 'многопоточность'],
    'stream-api': ['stream', 'стрим', 'map', 'filter', 'reduce', 'collect', 'lambda', 'лямбд', 'optional'],
    'memory': ['garbage', 'сборщик мусора', 'gc', 'heap', 'stack', 'memory', 'память', 'reference', 'oom', 'out of memory'],
    'spring-core': ['spring', 'спринг', 'bean', 'autowired', 'context', 'dependency injection', 'di', 'ioc', 'component'],
    'spring-boot': ['spring boot', 'starter', 'actuator', 'application.properties', 'yaml', 'yml'],
    'spring-mvc': ['mvc', 'controller', 'restcontroller', 'requestmapping', 'getmapping', 'postmapping', 'rest api'],
    'spring-data': ['jpa', 'hibernate', 'repository', 'entity', 'crudrepository', 'spring data'],
    'databases': ['sql', 'база данных', 'select', 'join', 'index', 'transaction', 'транзакци', 'acid', 'isolation', 'normalization', 'nosql', 'rdbms', 'postgresql', 'mysql'],
    'testing': ['junit', 'mockito', 'test', 'тест', 'assert', 'mock', 'spy', 'tdd'],
    'patterns': ['singleton', 'factory', 'builder', 'strategy', 'observer', 'decorator', 'proxy', 'pattern', 'паттерн'],
    'system-design': ['design', 'architecture', 'архитектур', 'microservice', 'микросервис', 'monolith', 'scalability', 'cap', 'load balancer', 'балансиров', 'cache', 'кэш'],
    'exceptions': ['exception', 'исключени', 'error', 'throw', 'catch', 'finally', 'runtimeexception'],
    'jvm': ['jvm', 'jre', 'jdk', 'classloader', 'bytecode', 'байткод', 'jit']
}

def analyze_tags(text):
    text_lower = text.lower()
    tags = set()
    for tag, keywords in TAG_RULES.items():
        for kw in keywords:
            if kw in text_lower:
                tags.add(tag)
                break
    return list(tags)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    if not lines:
        return

    has_explicit_frontmatter = False
    if lines[0].strip() == '---':
        has_explicit_frontmatter = True

    frontmatter_lines = []
    body_lines = []
    has_tags = False

    if has_explicit_frontmatter:
        in_frontmatter = False
        dash_count = 0
        for i, line in enumerate(lines):
            line_str = line.strip()
            if line_str == '---':
                dash_count += 1
                if dash_count == 1:
                    frontmatter_lines.append(line)
                    continue
                elif dash_count == 2:
                    # End of frontmatter
                    frontmatter_lines.append(line)
                    body_lines = lines[i+1:]
                    break
            else:
                frontmatter_lines.append(line)
                if line_str.startswith('tags:'):
                    has_tags = True
    else:
        in_frontmatter = True
        for i, line in enumerate(lines):
            line_str = line.strip()
            if not line_str:
                in_frontmatter = False
                body_lines = lines[i:]
                break
            
            meta_match = re.match(r'^([a-zA-Z0-9_-]+)\s*:\s*(.*)$', line_str)
            if meta_match:
                frontmatter_lines.append(line)
                if line_str.startswith('tags:'):
                    has_tags = True
            else:
                in_frontmatter = False
                body_lines = lines[i:]
                break

    if has_tags:
        return # Already tagged

    # Generate tags based on full content
    full_text = "".join(lines)
    tags = analyze_tags(full_text)
    
    if not tags:
        tags = ['general']

    tags_str = f"tags: [{', '.join(tags)}]\n"

    # Insert tags
    if has_explicit_frontmatter:
        # Insert before the last '---'
        frontmatter_lines.insert(-1, tags_str)
    else:
        # Insert at the end of implicit frontmatter
        frontmatter_lines.append(tags_str)

    new_content = "".join(frontmatter_lines) + "".join(body_lines)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    md_files = glob.glob('questions/**/*.md', recursive=True)
    count = 0
    for filepath in md_files:
        process_file(filepath)
        count += 1
    print(f"Обработано файлов: {count}")

if __name__ == '__main__':
    main()
