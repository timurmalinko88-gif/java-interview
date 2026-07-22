---
id: patterns-023
topic: Patterns
difficulty: Senior
format: System Design
time: 10
frequency: 25%
source: Custom
prerequisites: ["OOP", "Design Patterns", "Double Dispatch"]
tags: ['patterns']
---

# What is the Visitor Pattern?
Describe the Visitor design pattern. What problem does it solve and what is "Double Dispatch"?

---ANSWER---

The Visitor pattern is a behavioral pattern that lets you separate algorithms from the objects on which they operate. It is used when you need to perform operations on a complex object structure (like a composite tree) without modifying the classes of those objects.

It solves the problem of adding new operations to a class hierarchy without altering the classes themselves, preserving the Open/Closed Principle for the object structure.

It relies on a mechanism called **Double Dispatch**. In Java, method overloading is resolved at compile-time (Single Dispatch). To determine the correct execution at runtime based on *both* the concrete type of the Visitor AND the concrete type of the Element being visited, the Visitor pattern uses a two-step process:
1. The client calls `element.accept(visitor)`.
2. Inside the element, it calls `visitor.visit(this)`, passing its exact concrete type to the visitor.

### Life Analogy
An insurance agent (Visitor) visiting different types of buildings (Elements: Home, Factory, Store). The agent performs different assessments depending on the building type. The building just "accepts" the agent and lets them do their specific job.

### Key Points
- Adds new operations without modifying existing object classes.
- Heavily uses Double Dispatch to bypass Java's single dispatch limitation.
- Often used with the Composite pattern.
