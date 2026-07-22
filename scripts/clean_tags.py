import os
import glob
import re

def clean_tags():
    md_files = glob.glob(r"c:\java-prep\public\questions\**\*.md", recursive=True)
    
    topic_keywords = {
        'collections': ['collections', 'data-structures', 'lists', 'maps', 'sets', 'queues', 'iterators', 'list', 'map', 'set', 'queue', 'iterator', 'data structures', 'collection'],
        'oop': ['oop', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'classes', 'interfaces', 'class', 'interface'],
        'jvm': ['jvm', 'memory', 'gc', 'garbage-collection', 'classloader', 'bytecode', 'garbage collection'],
        'multithreading': ['multithreading', 'concurrency', 'threads', 'synchronization', 'locks', 'volatile', 'atomic', 'thread', 'lock', 'sync'],
        'spring': ['spring', 'spring-boot', 'spring-core', 'di', 'ioc', 'beans', 'aop', 'spring boot', 'bean'],
        'stream': ['stream', 'stream-api', 'lambda', 'functional', 'optional', 'streams'],
        'databases': ['databases', 'sql', 'jdbc', 'jpa', 'hibernate', 'transactions', 'database', 'transaction'],
        'patterns': ['patterns', 'design-patterns', 'singleton', 'factory', 'observer', 'strategy', 'design patterns', 'pattern'],
        'testing': ['testing', 'junit', 'mockito', 'tdd', 'integration-testing', 'test'],
        'system-design': ['system-design', 'architecture', 'microservices', 'scaling', 'caching', 'system design', 'microservice', 'cache'],
        'general': ['general', 'java-core', 'basics', 'exceptions', 'strings', 'generics', 'java core', 'basic', 'exception', 'string', 'generic']
    }
    
    for filepath in md_files:
        folder_name = os.path.basename(os.path.dirname(filepath))
        
        matched_topic = None
        for t in topic_keywords.keys():
            if folder_name == t or folder_name.startswith(t + '-'):
                matched_topic = t
                break
                
        if not matched_topic:
            continue
            
        allowed_keywords = topic_keywords[matched_topic]
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        lines = content.split('\n')
        if not lines:
            continue
            
        has_explicit = lines[0].strip() == '---'
        
        tag_pattern = re.compile(r'^tags\s*:\s*(.*)$', re.IGNORECASE)
        topic_pattern = re.compile(r'^topic\s*:\s*(.*)$', re.IGNORECASE)
        topic_value = None
        
        tags_line_idx = -1
        tags_match = None
        
        if has_explicit:
            for i in range(1, len(lines)):
                if lines[i].strip() == '---':
                    break
                m = tag_pattern.match(lines[i].strip())
                if m:
                    tags_match = m
                    tags_line_idx = i
                tm = topic_pattern.match(lines[i].strip())
                if tm:
                    topic_value = tm.group(1).strip().strip("'").strip('"')
        else:
            for i in range(len(lines)):
                if not lines[i].strip() or lines[i].startswith('#'):
                    break
                m = tag_pattern.match(lines[i].strip())
                if m:
                    tags_match = m
                    tags_line_idx = i
                tm = topic_pattern.match(lines[i].strip())
                if tm:
                    topic_value = tm.group(1).strip().strip("'").strip('"')
                    
        if tags_line_idx != -1:
            raw_tags = tags_match.group(1).strip().strip("'").strip('"')
            if raw_tags.startswith('[') and raw_tags.endswith(']'):
                raw_tags = raw_tags[1:-1]
            tags_list = [t.strip().strip("'").strip('"') for t in raw_tags.split(',')]
            tags_list = [t for t in tags_list if t]
            
            cleaned_tags = []
            for tag in tags_list:
                tag_lower = tag.lower()
                
                if tag_lower == folder_name.lower():
                    cleaned_tags.append(tag)
                    continue
                    
                keep = False
                for kw in allowed_keywords:
                    if re.search(r'\b' + re.escape(kw) + r'\b', tag_lower):
                        keep = True
                        break
                if keep:
                    cleaned_tags.append(tag)
                    
            if len(cleaned_tags) < 2:
                # keep original topic tag if it exists in tags
                if topic_value:
                    for t in tags_list:
                        if t.lower() == topic_value.lower() and t not in cleaned_tags:
                            cleaned_tags.append(t)
                            break
                            
            # format back
            new_tags_str = 'tags: [' + ', '.join(f"'{t}'" for t in cleaned_tags) + ']'
            lines[tags_line_idx] = new_tags_str
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines))

if __name__ == '__main__':
    clean_tags()
