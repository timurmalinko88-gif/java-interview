---
id: patterns-006
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["OOP", "Design Patterns", "Cloning"]
tags: ['patterns']
---

# What is the Prototype Pattern?
Explain the Prototype design pattern. When is it useful in Java and how does it relate to the `Cloneable` interface?

---ANSWER---

The Prototype pattern is a creational design pattern that allows copying existing objects without making the code dependent on their classes.

It is useful when the cost of creating a new object from scratch (e.g., via a database call or complex calculations) is more expensive than copying an existing one. 

In Java, it is often implemented using the `Cloneable` interface and overriding the `clone()` method. However, Java's built-in `Cloneable` is widely considered flawed because it's a marker interface without methods, and `Object.clone()` only performs a shallow copy. For a true Prototype pattern, a custom `copy()` or `clone()` method that guarantees deep copying (if necessary) is often preferred over standard Java cloning.

### Life Analogy
Cellular division. A cell doesn't build a new cell from scratch by assembling molecules one by one. Instead, it duplicates its own DNA and splits into two identical cells.

### Key Points
- Creates new objects by cloning an existing instance.
- Avoids expensive initialization.
- Java's `Cloneable` is often insufficient due to shallow copying.
