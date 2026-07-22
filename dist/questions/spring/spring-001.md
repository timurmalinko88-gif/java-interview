---
id: spring-001
topic: Spring
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["Core Java"]
tags: ['spring-core', 'spring-data']
---

# What is Inversion of Control (IoC) and Dependency Injection (DI) in Spring?
Explain the concepts of Inversion of Control and Dependency Injection in the context of the Spring Framework. Why are they important?

---ANSWER---

**Inversion of Control (IoC)** is a design principle where the control flow of a program is inverted. Instead of the custom code calling a library, the framework calls the custom code. In Spring, IoC means the Spring container takes responsibility for creating, configuring, and managing the lifecycle of objects (beans), taking this control away from the application code.

**Dependency Injection (DI)** is a specific implementation of IoC. It is a pattern where an object's dependencies are provided (injected) to it by an external entity (the Spring container) rather than the object creating them itself. 

They are important because:
1. They decouple components, making the code easier to test, maintain, and scale.
2. They promote interface-driven design.
3. They allow for easier substitution of implementations (e.g., swapping a real database service for a mock one during testing).

### Life Analogy
Imagine you are building a car. Without DI, the car object has to build its own engine and tires inside its constructor. With DI, a factory (the Spring container) builds the engine and tires separately and simply hands (injects) them to the car when assembling it.

### Key Points
- IoC is the principle; DI is the pattern implementing it.
- Spring container is the IoC container.
- DI enables loose coupling and easier unit testing.
