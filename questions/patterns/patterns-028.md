---
id: patterns-028
topic: Patterns
difficulty: Senior
format: Open Answer
time: 10
frequency: 95%
source: Custom
prerequisites: ["OOP", "SOLID", "Dependency Injection"]
---

# Dependency Inversion Principle (DIP)
Explain the Dependency Inversion Principle. How does it relate to Dependency Injection (DI) and Inversion of Control (IoC)?

---ANSWER---

The Dependency Inversion Principle (DIP) is the "D" in SOLID. It has two parts:
1. High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces).
2. Abstractions should not depend on details. Details should depend on abstractions.

It means instead of a `PaymentProcessor` (high-level) directly instantiating a `StripeAPI` class (low-level detail), both should depend on a `PaymentGateway` interface.

**Relation to DI and IoC:**
- **IoC (Inversion of Control)** is a broad concept where the control flow of a program is inverted: instead of the programmer controlling the flow, a framework controls it.
- **DIP** is the design principle that guides you to depend on abstractions.
- **DI (Dependency Injection)** is a specific technique/pattern to achieve IoC and DIP. Instead of a class instantiating its dependencies using `new`, the dependencies are injected into it (e.g., via constructor) by an external framework (like Spring).

### Life Analogy
Wiring a lamp. You don't solder the lamp's wires directly into the wall's power lines (tight coupling, high-level depending on low-level). Instead, both the wall and the lamp depend on an abstraction: the standard plug/socket interface.

### Key Points
- Depend on abstractions, not concretions.
- Avoid using the `new` keyword in high-level business logic.
- Spring Framework heavily utilizes DI to enforce this principle.
