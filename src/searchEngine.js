/**
 * High-Performance Smart Search Engine for Java Interview Prep Hub
 * Features:
 * 1. Multi-token fuzzy & keyword ranking (handles "spring jpa", "kafka consumer", "jvm memory")
 * 2. Russian <-> English technical synonym dictionary (e.g. "виртуальные потоки" -> "virtual threads")
 * 3. Exact ID deep match ("jvm-005", "ai-001")
 * 4. Tag & metadata boost
 */

// Comprehensive Russian -> English technical synonym dictionary
const RU_EN_SYNONYMS = {
  'поток': ['thread', 'concurrency', 'multithreading'],
  'потоки': ['threads', 'concurrency', 'multithreading'],
  'потоков': ['threads', 'multithreading'],
  'многопоточность': ['multithreading', 'concurrency', 'jmm', 'volatile', 'synchronized', 'lock'],
  'многопоточный': ['multithreading', 'concurrency', 'thread'],
  'виртуальный': ['virtual', 'loom'],
  'виртуальные': ['virtual', 'loom', 'threads'],
  'виртуальных': ['virtual', 'loom', 'threads'],
  'память': ['memory', 'heap', 'stack', 'metaspace', 'jvm'],
  'памяти': ['memory', 'heap', 'stack', 'metaspace', 'jvm'],
  'утечка': ['leak', 'memory leak', 'oom'],
  'утечки': ['leak', 'memory leak', 'oom'],
  'мусор': ['garbage', 'gc', 'g1', 'zgc'],
  'мусора': ['garbage', 'gc', 'g1', 'zgc'],
  'сборщик': ['garbage collector', 'gc', 'g1', 'zgc'],
  'сборка': ['garbage collection', 'gc'],
  'коллекция': ['collection', 'collections', 'list', 'map', 'set'],
  'коллекции': ['collection', 'collections', 'list', 'map', 'set'],
  'коллекций': ['collection', 'collections', 'list', 'map', 'set'],
  'список': ['list', 'arraylist', 'linkedlist'],
  'списки': ['list', 'arraylist', 'linkedlist'],
  'массив': ['array', 'arraylist'],
  'массивы': ['array', 'arrays'],
  'карта': ['map', 'hashmap', 'concurrenthashmap'],
  'хэш': ['hash', 'hashmap', 'hashcode'],
  'база': ['database', 'db', 'sql', 'jpa', 'hibernate'],
  'базы': ['database', 'db', 'sql', 'jpa', 'hibernate'],
  'бд': ['database', 'db', 'sql', 'jpa', 'hibernate', 'acid'],
  'запрос': ['query', 'sql', 'index', 'explain'],
  'запросы': ['query', 'queries', 'sql', 'indexes'],
  'транзакция': ['transaction', 'acid', 'isolation', 'transactional'],
  'транзакции': ['transactions', 'acid', 'isolation', 'transactional'],
  'изоляция': ['isolation', 'read committed', 'repeatable read', 'serializable'],
  'индекс': ['index', 'indexes', 'b-tree', 'indexing'],
  'индексы': ['indexes', 'indexing', 'b-tree'],
  'исключение': ['exception', 'throwable', 'catch', 'try'],
  'исключения': ['exceptions', 'throwable', 'hierarchy'],
  'ошибка': ['error', 'exception', 'throwable'],
  'ошибки': ['error', 'errors', 'exceptions'],
  'шаблон': ['pattern', 'design pattern', 'singleton', 'factory'],
  'шаблоны': ['patterns', 'design patterns'],
  'паттерн': ['pattern', 'singleton', 'factory', 'builder', 'proxy', 'observer', 'strategy'],
  'паттерны': ['patterns', 'design patterns'],
  'очередь': ['queue', 'kafka', 'messaging', 'blockingqueue'],
  'очереди': ['queues', 'kafka', 'messaging'],
  'сообщение': ['message', 'kafka', 'messaging'],
  'сообщения': ['messages', 'messaging', 'kafka'],
  'тест': ['test', 'testing', 'junit', 'mockito'],
  'тесты': ['tests', 'testing', 'junit', 'mockito'],
  'тестирование': ['testing', 'junit', 'mockito', 'tdd'],
  'строка': ['string', 'stringbuilder', 'stringbuffer'],
  'строки': ['string', 'strings', 'stringbuilder'],
  'блокировка': ['lock', 'synchronized', 'reentrantlock', 'deadlock', 'mutex'],
  'блокировки': ['locks', 'locking', 'deadlock'],
  'дедлок': ['deadlock', 'lock'],
  'дедлоки': ['deadlock', 'deadlocks'],
  'дженерик': ['generic', 'generics'],
  'дженерики': ['generics', 'type erasure'],
  'спринг': ['spring', 'spring boot', 'ioc', 'di', 'bean'],
  'кафка': ['kafka', 'partition', 'consumer', 'broker'],
  'кэш': ['cache', 'caching', 'redis'],
  'кэширование': ['cache', 'caching', 'redis'],
  'алгоритм': ['algorithm', 'sorting', 'searching', 'graph', 'tree', 'dp'],
  'алгоритмы': ['algorithms', 'sorting', 'dp', 'graph'],
  'сортировка': ['sorting', 'quicksort', 'mergesort'],
  'структура': ['structure', 'data structure', 'tree', 'graph', 'heap'],
  'структуры': ['structures', 'data structures'],
  'быстродействие': ['performance', 'optimization', 'latency', 'throughput'],
  'ускорить': ['optimize', 'performance', 'speed', 'index', 'cache'],
  'оптимизация': ['optimization', 'performance', 'tuning'],
  'сеть': ['network', 'http', 'tcp', 'rest', 'grpc'],
  'безопасность': ['security', 'jwt', 'oauth', 'spring security'],
};

/**
 * Normalizes text for search indexing and querying.
 * Removes extra punctuation and lowercases.
 */
export function normalizeSearchText(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9а-яё_@#-]+/gi, ' ').trim();
}

/**
 * Tokenizes user query and expands with Russian/English technical synonyms.
 * @param {string} rawQuery 
 * @returns {{ originalTokens: string[], expandedTokens: string[] }}
 */
export function processQueryTokens(rawQuery) {
  const normalized = normalizeSearchText(rawQuery);
  const rawTokens = normalized.split(/\s+/).filter(t => t.length > 0);
  
  const expandedSet = new Set(rawTokens);
  
  rawTokens.forEach(token => {
    // Check direct synonyms
    if (RU_EN_SYNONYMS[token]) {
      RU_EN_SYNONYMS[token].forEach(syn => {
        syn.split(/\s+/).forEach(s => expandedSet.add(s.toLowerCase()));
      });
    }
    // Check prefix stems for Russian queries (require min length 4)
    if (/[а-яё]/i.test(token) && token.length >= 4) {
      for (const [key, syns] of Object.entries(RU_EN_SYNONYMS)) {
        if (token.startsWith(key) || key.startsWith(token)) {
          syns.forEach(syn => syn.split(/\s+/).forEach(s => expandedSet.add(s.toLowerCase())));
        }
      }
    }
  });

  return {
    rawQuery: rawQuery.trim().toLowerCase(),
    originalTokens: rawTokens,
    expandedTokens: Array.from(expandedSet),
  };
}

/**
 * Computes a relevance score for a question against a search query.
 * @param {object} q - Question object from index.json
 * @param {object} queryData - Output from processQueryTokens
 * @returns {number} Score (0 means no match)
 */
export function scoreQuestion(q, queryData) {
  const { rawQuery, originalTokens, expandedTokens } = queryData;
  if (!rawQuery) return 1.0;

  const id = (q.id || '').toLowerCase();
  const title = (q.title || '').toLowerCase();
  const topic = (q.topic || '').toLowerCase();
  const tags = Array.isArray(q.tags) ? q.tags.map(t => t.toLowerCase()) : [];
  const questionBody = (q.question || q.loadedQuestion || '').toLowerCase();
  const answerBody = (q.answer || q.loadedAnswer || '').toLowerCase();

  let score = 0;

  // 1. Exact ID Match (e.g. "jvm-005", "ai-001")
  if (id === rawQuery || id.replace('#', '') === rawQuery) {
    return 1000;
  }
  if (id.includes(rawQuery)) {
    score += 200;
  }

  // 2. Exact full phrase match in Title
  if (title.includes(rawQuery)) {
    score += 150;
  }

  // 3. Exact full phrase match in Topic
  if (topic.includes(rawQuery)) {
    score += 80;
  }

  // 4. Exact match in Tags
  if (tags.some(tag => tag === rawQuery || tag.includes(rawQuery))) {
    score += 90;
  }

  // 5. Multi-token evaluation with Original and Expanded Tokens
  let originalTokensMatchedInTitle = 0;
  let originalTokensMatchedAnywhere = 0;
  let expandedTokensMatched = 0;

  originalTokens.forEach(token => {
    let matchedInTitle = false;
    let matchedAnywhere = false;

    if (title.includes(token)) {
      matchedInTitle = true;
      matchedAnywhere = true;
      score += 40;
    }
    if (tags.some(t => t.includes(token))) {
      matchedAnywhere = true;
      score += 30;
    }
    if (topic.includes(token)) {
      matchedAnywhere = true;
      score += 20;
    }
    if (questionBody.includes(token)) {
      matchedAnywhere = true;
      score += 10;
    }
    if (answerBody.includes(token)) {
      matchedAnywhere = true;
      score += 5;
    }

    if (matchedInTitle) originalTokensMatchedInTitle++;
    if (matchedAnywhere) originalTokensMatchedAnywhere++;
  });

  // Synonym expansions (Russian to English bridge)
  expandedTokens.forEach(token => {
    if (!originalTokens.includes(token)) {
      if (title.includes(token)) {
        expandedTokensMatched++;
        score += 35;
      } else if (tags.some(t => t.includes(token))) {
        expandedTokensMatched++;
        score += 25;
      } else if (topic.includes(token)) {
        expandedTokensMatched++;
        score += 15;
      } else if (questionBody.includes(token) || answerBody.includes(token)) {
        expandedTokensMatched++;
        score += 8;
      }
    }
  });

  // Bonus for matching ALL original tokens in Title or anywhere
  if (originalTokens.length > 1) {
    if (originalTokensMatchedInTitle === originalTokens.length) {
      score += 100;
    } else if (originalTokensMatchedAnywhere === originalTokens.length) {
      score += 60;
    }
  }

  // Return score only if genuine match occurred
  const hasGenuineMatch = (
    id === rawQuery ||
    id.includes(rawQuery) ||
    title.includes(rawQuery) ||
    topic.includes(rawQuery) ||
    originalTokensMatchedAnywhere > 0 ||
    (expandedTokensMatched > 0 && originalTokens.some(t => /[а-яё]/i.test(t)))
  );

  if (score > 0 && hasGenuineMatch) {
    return score;
  }

  return 0;
}

/**
 * Filters and ranks questions based on query and filters.
 * @param {Array<object>} questions - All base questions
 * @param {string} rawQuery - User search text
 * @returns {Array<object>} Filtered and sorted questions
 */
export function filterAndRankQuestions(questions, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) {
    return questions;
  }

  const queryData = processQueryTokens(rawQuery);
  const scored = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const s = scoreQuestion(q, queryData);
    if (s > 0) {
      scored.push({ question: q, score: s });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.map(item => item.question);
}
