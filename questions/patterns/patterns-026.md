---
id: patterns-026
topic: Patterns
difficulty: Senior
format: Code Review
time: 10
frequency: 85%
source: Custom
prerequisites: ["OOP", "SOLID", "Inheritance"]
---

# Liskov Substitution Principle (LSP)
Explain the Liskov Substitution Principle. What is the classic "Square/Rectangle" problem?

---ANSWER---

The Liskov Substitution Principle (LSP) is the "L" in SOLID. It states that objects of a superclass shall be replaceable with objects of its subclasses without breaking the application. In other words, a subclass must honor the contract established by its superclass.

The classic violation is the **Square/Rectangle problem**. 
Mathematically, a Square is a Rectangle. So, you might make `Square extends Rectangle`.
However, a `Rectangle` has independent `setWidth()` and `setHeight()` methods. If you pass a `Square` into a method that expects a `Rectangle`, that method might call `setWidth(5)` and `setHeight(10)`. If the `Square` overrides these methods to keep sides equal (e.g., setting both to 10), the method's assertion that the area is 50 will fail. The `Square` violated the `Rectangle`'s contract.

**Fix:**
Square should not inherit from Rectangle. They might instead share a common `Shape` interface with a `getArea()` method.

### Life Analogy
If it looks like a duck, quacks like a duck, but needs batteries, you probably have a toy duck. A toy duck fails the Liskov Substitution test if you drop it in a pond expecting it to act like a real duck.

### Key Points
- Subtypes must be substitutable for their base types.
- Inheritance should not break expected behavior.
- Favor composition over inheritance if LSP cannot be maintained.
