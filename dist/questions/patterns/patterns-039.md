---
id: patterns-039
topic: Patterns
difficulty: Middle
format: Code Review
time: 5
frequency: 70%
source: Custom
prerequisites: ["Anti-patterns", "Refactoring"]
tags: [oop, spring-core, system-design, patterns]
---

# Anti-pattern: Shotgun Surgery
What is the Shotgun Surgery anti-pattern? How does it differ from Divergent Change?

---ANSWER---

Shotgun Surgery is a "code smell" or anti-pattern that occurs when adding a single, simple feature or making a small modification requires you to make many small changes to many different classes across the codebase.

It indicates tight coupling and a violation of the Single Responsibility Principle, as logic that should be grouped together is scattered.

**Difference from Divergent Change:**
- **Shotgun Surgery**: One change requires modifying *many classes*. (One-to-Many).
- **Divergent Change**: One class has to be modified for *many different reasons*. (Many-to-One). This is the classic violation of SRP (the God Object).

**How to fix Shotgun Surgery:**
Use the "Move Method" or "Move Field" refactoring techniques to pull the scattered logic into a single cohesive class.

### Life Analogy
If you want to change the color of your car's interior, Shotgun Surgery means you have to unscrew every single panel, dashboard gauge, and seat cover individually, paint them, and put them back. Good design means swapping out one "Interior Color Module".

### Key Points
- One change causes a ripple effect across many files.
- Sign of poor cohesion and scattered logic.
- Fix by consolidating related logic into a single place.
