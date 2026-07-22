---
id: testing-042
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["JUnit 5"]
tags: [testing, oop, spring-core, collections]
---

# JUnit 5 @Nested

What does `@Nested` do in JUnit 5?

---ANSWER---

`@Nested` allows you to group related test methods into inner classes within a main test class. It helps organize tests and share setup methods (`@BeforeEach`) for a specific context.

### Life Analogy
It's like having folders inside folders on your computer to keep related documents together.

### Key Points
- Organizes tests hierarchically.
- Shares context.
