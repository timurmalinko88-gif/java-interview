---
id: patterns-007
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# What is the Adapter Pattern?
Describe the Adapter design pattern. What problem does it solve and what are the two main ways to implement it?

---ANSWER---

The Adapter pattern is a structural design pattern that allows objects with incompatible interfaces to collaborate. It acts as a wrapper that translates calls from one interface into another.

It solves the problem of integrating new components or third-party libraries into an existing system when their interfaces don't match.

There are two main ways to implement an Adapter:
1. **Object Adapter (Composition)**: The adapter implements the target interface and wraps an instance of the adaptee class. This is the preferred approach as it is more flexible.
2. **Class Adapter (Inheritance)**: The adapter inherits from both the target interface and the adaptee class. This requires multiple inheritance, which is not supported in Java (except for interfaces), making this approach less common in Java.

### Life Analogy
A travel power adapter. You have a US laptop plug, but you are in Europe where the wall socket is different. You plug your US plug into the adapter, and the adapter plugs into the European wall socket.

### Key Points
- Makes incompatible interfaces compatible.
- Object Adapter uses composition (preferred).
- Class Adapter uses inheritance.
