---
id: mcq-sd-003
topic: System Design
difficulty: Senior
format: MCQ
tags: ['system-design']
---
Which of the following tasks is USUALLY NOT solved by an API Gateway in a microservice architecture?

A. Authentication and authorization
B. Rate Limiting
C. Storing persistent business data (like a DB)
D. Routing requests to the appropriate microservices

---ANSWER---
**Correct Answer: C**

### Key Points
- The API Gateway should be a lightweight layer (Stateless) responsible for security, routing, aggregation, and monitoring. Business data should be stored within specific microservices.
