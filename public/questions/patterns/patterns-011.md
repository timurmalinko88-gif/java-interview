---
id: patterns-011
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# What is the Facade Pattern?
Explain the Facade design pattern. What problem does it solve and how does it relate to the Principle of Least Knowledge (Law of Demeter)?

---ANSWER---

The Facade pattern provides a simplified, higher-level interface to a complex subsystem of classes, making the subsystem easier to use. 

It solves the problem of tightly coupling client code to a complex set of internal components. Instead of the client interacting with many different objects directly, it interacts with a single Facade object, which then delegates the work to the appropriate subsystem classes.

This relates strongly to the Principle of Least Knowledge (Law of Demeter), which states that an object should only talk to its immediate friends and not navigate through complex object graphs. By using a Facade, the client only needs to know about one friend (the Facade), rather than the entire neighborhood of subsystem classes.

### Life Analogy
Ordering a pizza by phone. You (the client) talk to the operator (the Facade). You don't need to individually talk to the dough maker, the sauce chef, and the oven operator. The operator handles coordinating all those complex internal subsystems for you.

### Key Points
- Provides a simplified interface to a complex subsystem.
- Decouples clients from subsystem components.
- Supports the Principle of Least Knowledge.
