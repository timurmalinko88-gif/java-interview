---
id: patterns-025
topic: Patterns
difficulty: Middle
format: Code Review
time: 10
frequency: 90%
source: Custom
prerequisites: ["OOP", "SOLID"]
tags: [testing, oop, spring-core, patterns]
---

# Open/Closed Principle (OCP)
What is the Open/Closed Principle? How do we typically achieve this in Java?

---ANSWER---

The Open/Closed Principle (OCP) is the "O" in SOLID. It states that software entities (classes, modules, functions) should be open for extension but closed for modification. 

This means you should be able to add new functionality to an existing module without altering its source code. Modifying existing code introduces the risk of breaking existing functionality.

In Java, this is primarily achieved through **polymorphism** using interfaces and abstract classes. Instead of writing code that checks conditions (e.g., `if (type == A) ... else if (type == B) ...`), you define an interface. The existing code depends on the interface. To add new functionality, you create a new class that implements the interface and inject it into the system, without touching the original code.

### Life Analogy
A computer's USB port. The computer is closed for modification (you don't have to unscrew the case and solder wires to add a mouse). But it is open for extension (you can plug in any USB device that follows the interface contract).

### Key Points
- Open for extension, closed for modification.
- Avoids breaking existing, tested code.
- Achieved via polymorphism (interfaces/abstract classes).
