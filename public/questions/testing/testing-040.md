---
id: testing-040
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["Spring Boot", "Integration Testing"]
tags: [spring-boot, testing, spring-core, databases]
---

# Transactional Tests

Why do we annotate Spring integration tests with `@Transactional`?

---ANSWER---

When an integration test is annotated with `@Transactional`, Spring will automatically rollback any database changes made during the test after the test completes. This ensures that tests don't pollute the database state for subsequent tests.

### Life Analogy
It's an Etch A Sketch. You draw a picture (run test), and then shake it to erase everything (rollback) so the next person gets a blank slate.

### Key Points
- Rolls back DB changes.
- Ensures test isolation.
