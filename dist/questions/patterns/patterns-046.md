---
id: patterns-046
topic: Patterns
difficulty: Middle
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["OOP", "Anti-patterns"]
tags: [oop, spring-core, system-design, patterns, databases, testing, memory, collections]
---

# Anti-pattern: Circular Dependency
What is a Circular Dependency? Why does it break the architecture and how can it be resolved?

---ANSWER---

A Circular Dependency occurs when two or more modules, classes, or packages depend on each other, either directly or indirectly. 
For example: Class A depends on Class B, and Class B depends on Class A.

**Why it breaks architecture:**
- **Impossible to test in isolation**: You cannot unit test Class A without also loading Class B, and vice versa.
- **Tight Coupling**: They effectively act as a single, large, complex module.
- **Build Failures**: In many languages and frameworks (like older versions of Spring), it can cause stack overflows or application context initialization failures during bean creation.

**How to resolve:**
1. **Extract an Interface**: Have Class B depend on an interface implemented by Class A, rather than depending on the concrete Class A.
2. **Extract a Third Class**: If A and B share functionality that causes the cycle, extract that common functionality into a new Class C, and have both A and B depend on C.
3. **Use Events/Observer Pattern**: Instead of direct calls, Class A can publish an event that Class B listens to.

### Life Analogy
The Chicken and the Egg problem. You can't have a chicken without an egg, and you can't have an egg without a chicken. If you try to build a factory that requires a chicken to make an egg and an egg to make a chicken, the factory will never start.

### Key Points
- Mutual dependency between components.
- Creates tight coupling and testing nightmares.
- Resolve by introducing interfaces, extracting common code, or using events.
