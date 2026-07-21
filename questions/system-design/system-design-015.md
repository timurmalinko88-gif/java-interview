---
id: system-design-015
topic: System Design
difficulty: Middle
format: System Design
time: 20
frequency: 85%
source: Custom
prerequisites: ["Microservices", "Architecture"]
---

# API Gateway Pattern

What is an API Gateway? What functionalities does it typically provide in a microservices architecture, and what are the drawbacks of using one?

---ANSWER---

An **API Gateway** is a server that acts as the single entry point into a system. It sits between the client applications and the internal backend microservices. 

Instead of a mobile app making dozens of direct HTTP calls to the `User Service`, `Order Service`, and `Inventory Service` (which exposes internal architecture and IP addresses), the app makes one call to the API Gateway.

**Core Functionalities:**
- **Routing**: Maps external requests to the correct internal microservice based on URL path or headers (e.g., `/api/users` -> `UserService`).
- **Authentication/Authorization**: Validates JWTs or API keys centrally so individual microservices don't have to duplicate this logic.
- **Rate Limiting & Throttling**: Protects backend services from abuse.
- **SSL Termination**: Decrypts HTTPS traffic before forwarding it internally.
- **Protocol Translation**: Converts REST/HTTP from the client into gRPC or AMQP for internal services.
- **Response Aggregation**: (Sometimes called Backend-For-Frontend) Combines responses from multiple microservices into a single JSON response for the client to reduce round-trips.

**Drawbacks:**
- **Single Point of Failure**: If the gateway goes down, the entire application is inaccessible. (Requires HA deployment).
- **Bottleneck**: All traffic flows through it, which can cause latency if not scaled properly.
- **Deployment Coupling**: Developers might need to update the gateway configuration every time they deploy a new microservice, slowing down release cycles.

### Life Analogy
An API Gateway is like a receptionist at a large corporate building. Instead of wandering the halls looking for the HR or IT department, you talk to the receptionist. They check your ID (Authentication), direct you to the right floor (Routing), and prevent too many people from entering at once (Rate Limiting).

### Key Points
- Acts as a reverse proxy and single entry point for all clients.
- Centralizes cross-cutting concerns (Auth, Rate Limiting, SSL, Routing).
- Must be highly available to avoid becoming a single point of failure.
