export const ROADMAPS = {
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
