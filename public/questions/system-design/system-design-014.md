---
id: system-design-014
topic: System Design
difficulty: Senior
format: Open Answer
time: 15
frequency: 80%
source: Custom
prerequisites: ["Microservices", "Resiliency"]
tags: [spring-core, system-design, patterns, testing, multithreading, collections, exceptions]
---

# Circuit Breaker Pattern

In a microservices architecture, what is the Circuit Breaker pattern? How does it prevent cascading failures, and what are its three states?

---ANSWER---

In a distributed system, a service (Service A) might call another service (Service B). If Service B is down or extremely slow, Service A's threads will block waiting for a response. Eventually, Service A will run out of threads and crash. This is a **cascading failure**.

The **Circuit Breaker** pattern prevents this by wrapping calls to external services and detecting when they are failing.

**The Three States:**
1. **Closed (Normal)**: The circuit is closed, and requests flow freely to the external service. The breaker monitors failures (timeouts, 5xx errors). If failures exceed a configured threshold within a time window, the breaker trips to the *Open* state.
2. **Open (Failing)**: The circuit is open. The breaker immediately returns an error (or a fallback response) to the caller *without* attempting to call the external service. This gives the failing service time to recover and prevents the caller from blocking.
3. **Half-Open (Testing)**: After a configured timeout period, the breaker allows a limited number of test requests to pass through to the external service. 
   - If they succeed, the breaker resets to *Closed*.
   - If they fail, the breaker returns to *Open* and the timeout period restarts.

Libraries like Resilience4j (Java) or Netflix Hystrix (deprecated) implement this pattern.

### Life Analogy
Just like an electrical circuit breaker in your house. If you plug in too many appliances (heavy load/fault), the breaker "trips" (Open state) to cut the power and prevent the house from burning down (cascading failure). You have to wait and test the switch (Half-Open) before power flows normally again (Closed).

### Key Points
- Prevents a slow or dead microservice from taking down the entire system (cascading failures).
- Fails fast in the Open state, returning fallback data or immediate errors to free up threads.
- Automatically recovers via the Half-Open testing state.
