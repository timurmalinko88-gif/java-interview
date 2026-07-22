---
id: testing-009
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Unit Testing", "Integration Testing"]
tags: [oop, spring-core, databases, testing, collections]
---

# Unit vs Integration Testing

What is the difference between Unit Testing and Integration Testing?

---ANSWER---

**Unit Testing:** Tests individual components (classes or methods) in isolation, often mocking dependencies. They are fast and pinpoint exactly where a bug is.
**Integration Testing:** Tests how different modules or systems work together (e.g., your service and the database). They are slower and require environment setup.

### Life Analogy
Unit testing is testing a single car wheel to see if it spins. Integration testing is putting the wheel on the car and driving to see if the whole system works.

### Key Points
- Unit: Isolated, fast, mocks used.
- Integration: Combined parts, slower, real dependencies.
