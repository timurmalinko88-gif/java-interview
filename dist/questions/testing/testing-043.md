---
id: testing-043
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 50%
source: Custom
prerequisites: ["Integration Testing"]
tags: [testing, spring-core, collections]
---

# WireMock

What is WireMock and when would you use it?

---ANSWER---

WireMock is a tool for mocking HTTP APIs. It creates an actual HTTP server in your test environment that returns canned responses. You use it in integration tests to mock external 3rd-party services (like a payment gateway) that your application depends on.

### Life Analogy
It's like setting up a fake answering machine to pretend someone is home when testing your phone system.

### Key Points
- Mocks HTTP APIs.
- Used for external dependencies.
