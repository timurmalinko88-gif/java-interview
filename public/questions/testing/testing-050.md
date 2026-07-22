---
id: testing-050
topic: Testing
difficulty: Senior
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["JUnit 5"]
tags: [testing, oop, spring-core, exceptions]
---

# JUnit 5 Extensions

How do you extend JUnit 5 behavior?

---ANSWER---

JUnit 5 replaced JUnit 4's `Runner` and `Rule` concepts with a single coherent Extension Model. You use the `@ExtendWith` annotation and implement one or more extension interfaces (e.g., `BeforeEachCallback`, `TestExecutionExceptionHandler`).

### Life Analogy
Instead of completely replacing the engine to add a turbocharger (JUnit 4 Runners), JUnit 5 gives you plug-and-play ports (Extensions) to attach whatever you want to the engine.

### Key Points
- `@ExtendWith`.
- Replaces Runners and Rules.
