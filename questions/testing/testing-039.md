---
id: testing-039
topic: Testing
difficulty: Senior
format: Open Answer
time: 5
frequency: 30%
source: Custom
prerequisites: ["JUnit 5"]
---

# JUnit 5 @TestFactory

What is `@TestFactory` in JUnit 5?

---ANSWER---

It is used for Dynamic Tests. Unlike `@Test` methods which are fully specified at compile time, a `@TestFactory` method returns a collection, stream, or iterable of `DynamicTest` instances generated at runtime.

### Life Analogy
Standard tests are a pre-printed exam. Dynamic tests are an exam where the teacher generates questions on the fly based on the day of the week.

### Key Points
- Generates tests at runtime.
- Returns `DynamicTest`.
