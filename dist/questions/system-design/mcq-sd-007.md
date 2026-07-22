---
id: mcq-sd-007
topic: System Design
difficulty: Senior
format: MCQ
tags: ['system-design']
---
Which pattern solves the problem of distributed transactions across multiple microservices?

A. Singleton
B. Saga
C. Circuit Breaker
D. API Composition

---ANSWER---
**Correct Answer: B (Saga)**

### Key Points
- In a microservice architecture, there are no local ACID transactions spanning multiple databases.
- The Saga pattern breaks a business process into a sequence of local transactions. If a step fails, compensating transactions are triggered (rolling back previous steps).
