---
id: patterns-017
topic: Patterns
difficulty: Senior
format: Open Answer
time: 10
frequency: 30%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# What is the Mediator Pattern?
Describe the Mediator design pattern. How does it compare to the Observer pattern?

---ANSWER---

The Mediator pattern is a behavioral pattern that reduces chaotic dependencies between objects. It restricts direct communications between the objects and forces them to collaborate only via a mediator object.

Instead of objects tightly coupling to each other (an N-to-N relationship), they all couple only to the Mediator (a 1-to-N relationship). 

**Comparison to Observer:**
Both facilitate communication between objects.
- **Observer** relies on a publish/subscribe model. Objects (Observers) subscribe to a Subject. The Subject broadcasts events, and Observers react. Communication is decentralized and one-way.
- **Mediator** centralizes communication. Components know about the Mediator and explicitly tell it when something happens. The Mediator contains the business logic to decide which other components to notify. Communication is centralized and often two-way.

### Life Analogy
Air Traffic Control. Planes don't talk to each other to coordinate landings; that would be chaos. Instead, every plane talks only to the Air Traffic Control tower (the Mediator), which tells them who can land and when.

### Key Points
- Centralizes complex communications and control logic.
- Reduces tight coupling between multiple interacting components.
- Differs from Observer by centralizing control rather than distributing it.
