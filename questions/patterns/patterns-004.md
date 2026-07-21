---
id: patterns-004
topic: Patterns
difficulty: Middle
format: Open Answer
time: 10
frequency: 70%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: [oop, spring-core, system-design, patterns]
---

# Abstract Factory vs Factory Method
What is the difference between the Abstract Factory and Factory Method patterns? When should you choose Abstract Factory?

---ANSWER---

Both are creational patterns, but they differ in scope and complexity.

**Factory Method**:
- Uses inheritance.
- Creates exactly one type of product.
- Defers the creation of a single object to subclasses.

**Abstract Factory**:
- Uses object composition.
- Creates families of related or dependent objects.
- Defines an interface for creating multiple distinct products (a suite of objects).

Choose Abstract Factory when your system needs to be independent of how its products are created, composed, and represented, AND the system is configured with one of multiple families of products. For example, a UI toolkit that needs to create Mac-style buttons and scrollbars OR Windows-style buttons and scrollbars.

### Life Analogy
Factory Method is like a single restaurant franchise: a McDonald's makes Big Macs. Abstract Factory is like a huge food conglomerate that provides entire food kits: one kit is Mexican (tacos, salsa, churros), another is Italian (pasta, marinara, cannoli).

### Key Points
- Factory Method = One product via inheritance.
- Abstract Factory = Family of products via composition.
- Abstract Factory often uses Factory Methods internally.
