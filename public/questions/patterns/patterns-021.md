---
id: patterns-021
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# What is the Strategy Pattern?
Explain the Strategy design pattern. What is the primary benefit of using it over a large `switch` statement?

---ANSWER---

The Strategy pattern is a behavioral pattern that lets you define a family of algorithms, put each of them into a separate class, and make their objects interchangeable. 

The primary benefit is adherence to the Open/Closed Principle. If you use a large `switch` statement to choose an algorithm (like choosing between PayPal, Credit Card, or Crypto for payment), adding a new algorithm requires modifying the `switch` statement, which violates the Open/Closed Principle.

With the Strategy pattern, you define a common interface (e.g., `PaymentStrategy`). Each algorithm implements this interface. The context class holds a reference to a `PaymentStrategy` and delegates the work to it. Adding a new payment method simply means creating a new class; you don't have to touch the existing code.

### Life Analogy
Traveling to the airport. You can choose different strategies: taking a taxi, riding a bike, or walking. The goal is the same, but the algorithm (strategy) changes based on your context (time, money).

### Key Points
- Defines a family of interchangeable algorithms.
- Replaces complex conditional statements.
- Heavily relies on composition over inheritance.
