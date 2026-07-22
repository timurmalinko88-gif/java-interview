---
id: testing-031
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Integration Testing", "Spring Boot"]
tags: [spring-core, testing, memory, spring-boot]
---

# Integration Test Database

How do you configure a separate database for integration tests in Spring Boot?

---ANSWER---

You can use the `@ActiveProfiles("test")` annotation to load an `application-test.yml` file that contains the database connection details for your testing environment (e.g., an H2 in-memory DB or a Testcontainer URL).

### Life Analogy
It's like using monopoly money when playing a board game, so you don't ruin your real bank account.

### Key Points
- Use `@ActiveProfiles`.
- Provide an `application-test.yml`.
