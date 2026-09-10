export const ROADMAPS = {
  transition: {
    name: "Переход в Java (6–8 недель)",
    isOrdered: true,
    targetPassRate: 80,
    stages: [
      {
        id: "core",
        title: "Этап 1 (Недели 1–2): Core Java & Collections",
        topics: ["General", "Collections", "OOP", "Stream API"]
      },
      {
        id: "spring-db",
        title: "Этап 2 (Неделя 3): Spring Ecosystem & Databases",
        topics: ["Spring", "Databases"]
      },
      {
        id: "concurrency-jvm",
        title: "Этап 3 (Неделя 4): Concurrency & JVM Essentials",
        topics: ["Multithreading", "JVM & Memory Management", "Exceptions"]
      },
      {
        id: "sysdesign-kafka",
        title: "Этап 4 (Неделя 5): System Design & Messaging",
        topics: ["System Design", "Kafka & Messaging", "Patterns", "Testing"]
      }
    ],
    filter: (q) => {
      // Must belong to one of the 4 defined sequential stages
      const stageTopics = [
        "General", "Collections", "OOP", "Stream API",
        "Spring", "Databases",
        "Multithreading", "JVM & Memory Management", "Exceptions",
        "System Design", "Kafka & Messaging", "Patterns", "Testing"
      ];
      if (!stageTopics.includes(q.topic)) return false;

      // Exclude AI & LLM integration
      if (q.topic === "AI & LLM Integration") return false;

      // Always include target verdict review and core-middle questions
      const tags = q.tags || [];
      if (tags.includes('verdict-review') || tags.includes('core-middle')) return true;

      // Must be High frequency
      if (q.frequency !== 'High') return false;

      // Middle difficulty, or Junior essentials in Core Java
      if (q.difficulty === 'Middle') return true;
      if (q.difficulty === 'Junior' && ['General', 'Collections', 'OOP'].includes(q.topic)) return true;

      return false;
    }
  },
  junior: {
    name: "Junior Express",
    limit: 50,
    filters: {
      difficulties: ["Junior", "Middle"],
      tags: ["collections", "oop", "sql", "spring", "jvm"]
    }
  },
  middle: {
    name: "Middle Spring & Microservices",
    limit: 150,
    filters: {
      difficulties: ["Middle", "Senior"],
      tags: ["spring", "kafka", "messaging", "database", "testing", "stream"]
    }
  },
  senior: {
    name: "Senior Architect Track",
    limit: 100,
    filters: {
      difficulties: ["Senior"],
      tags: ["system-design", "architecture", "multithreading", "java21", "performance"]
    }
  },
  ai: {
    name: "AI & Modern Java 21 Track",
    limit: 40,
    filters: {
      difficulties: ["Middle", "Senior"],
      tags: ["ai", "llm", "spring-ai", "java21", "virtual-threads"]
    }
  },
  llmTrack: {
    name: "LLM Integration with Java (7 модулей + проект)",
    isOrdered: true,
    targetPassRate: 80,
    stages: [
      { id: "mod1", title: "Модуль 1: Основы LLM API", tag: "module-1" },
      { id: "mod2", title: "Модуль 2: Интеграция со Spring Boot", tag: "module-2" },
      { id: "mod3", title: "Модуль 3: Tool / Function Calling", tag: "module-3" },
      { id: "mod4", title: "Модуль 4: Безопасность и надёжность", tag: "module-4" },
      { id: "mod5", title: "Модуль 5: Контекст и prompts", tag: "module-5" },
      { id: "mod6", title: "Модуль 6: Тестирование и evaluations", tag: "module-6" },
      { id: "mod7", title: "Модуль 7: Production basics", tag: "module-7" },
      { id: "mod8", title: "Модуль 8: Google Antigravity & Agentic Dev", tag: "module-antigravity" }
    ],
    filter: (q) => {
      const tags = q.tags || [];
      return tags.includes('llm-track') || (q.id && q.id.startsWith('llm-'));
    }
  }
};

ROADMAPS.llm = ROADMAPS.llmTrack;

