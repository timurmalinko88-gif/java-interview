---
id: testing-044
topic: Testing
difficulty: Middle
format: System Design
time: 5
frequency: 70%
source: Custom
prerequisites: ["Web Protocols"]
tags: ['testing']
---

# API Gateway

What is an API Gateway?

---ANSWER---

An API Gateway is a server that acts as a single entry point for a group of microservices. It handles routing, composition, authentication, rate limiting, and CORS, so individual microservices don't have to implement these cross-cutting concerns.

### Life Analogy
It's a receptionist at a large office building. They check your ID, figure out who you need to see, and point you to the right elevator.

### Key Points
- Single entry point.
- Handles cross-cutting concerns.
