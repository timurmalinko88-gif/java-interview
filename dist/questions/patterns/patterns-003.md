---
id: patterns-003
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# What is the Factory Method Pattern?
Describe the Factory Method design pattern. How does it differ from a Simple Factory?

---ANSWER---

The Factory Method pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate. It defers the instantiation to subclasses.

In a Simple Factory, you typically have a single class with a method (often static) containing a `switch` or `if-else` statement that instantiates different concrete classes based on an input parameter. If you add a new type, you must modify this factory class, violating the Open/Closed Principle.

With the Factory Method pattern, you have an abstract creator class (or interface) that declares a factory method. Concrete creator subclasses implement this method to instantiate specific product classes. Adding a new product simply means adding a new concrete creator, adhering to the Open/Closed Principle.

### Life Analogy
A Simple Factory is like a generic car dealership where you tell them what car you want, and they get it for you. The Factory Method is like a car manufacturing franchise: the franchise rules (interface) say you must produce cars, but the specific factory in Germany produces BMWs, while the one in Japan produces Toyotas.

### Key Points
- Defers instantiation to subclasses.
- Adheres to Open/Closed Principle better than a Simple Factory.
- Promotes loose coupling.
