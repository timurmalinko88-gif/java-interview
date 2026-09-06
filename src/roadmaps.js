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
  }
};
