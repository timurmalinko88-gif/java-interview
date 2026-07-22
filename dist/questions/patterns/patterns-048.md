---
id: patterns-048
topic: Patterns
difficulty: Junior
format: Code Review
time: 5
frequency: 90%
source: Custom
prerequisites: ["Anti-patterns"]
tags: [oop, spring-core, patterns, testing, memory, spring-data, spring-boot]
---

# Anti-pattern: Hardcoding
What is Hardcoding and why is it considered a bad practice, particularly for configurations?

---ANSWER---

Hardcoding is the practice of embedding data directly into the source code of a program, rather than obtaining that data from external sources (like a database, a configuration file, or user input).

**Examples:**
- Hardcoding a database password in a Java class.
- Hardcoding the URL of a third-party API.
- Hardcoding the file path `C:/users/admin/data.txt`.

**Why it's bad:**
- **Inflexibility**: If the database password changes, or you need to deploy the application to a testing environment instead of production, you have to modify the source code and recompile the entire application.
- **Security**: Hardcoding secrets (like passwords or API keys) in source code means anyone with read access to the repository can steal those credentials.

**Fix:**
Extract variable data into external configuration files (e.g., `application.properties`, `.env` files) or environment variables, which can be changed without touching the code.

### Life Analogy
Supergluing your furniture to the floor of your house (Hardcoding). If you ever decide to rearrange the room or move to a new house, you have to break the furniture. It's much better to leave it movable (Configuration).

### Key Points
- Embedding variable data in source code.
- Makes the application rigid and difficult to deploy across environments.
- Major security risk for passwords and keys.
