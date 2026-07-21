---
id: testing-013
topic: Testing
difficulty: Senior
format: System Design
time: 10
frequency: 50%
source: Custom
prerequisites: ["Microservices", "Testing"]
tags: [spring-core, testing, memory, system-design]
---

# Consumer-Driven Contract Testing

What is Consumer-Driven Contract Testing (e.g., Pact)?

---ANSWER---

Contract testing ensures that services (like microservices) can communicate with each other. In consumer-driven contract testing, the *consumer* defines the expectations (the "contract") of what the provider should return. The *provider* then runs tests against these contracts to ensure it doesn't break the consumer.

### Life Analogy
It's like signing a lease agreement. The tenant (consumer) specifies what they need (2 bedrooms, hot water). The landlord (provider) signs it and is bound to provide exactly that.

### Key Points
- Consumer dictates the required API behavior.
- Provider tests itself against these requirements.
- Prevents breaking changes in microservices.
