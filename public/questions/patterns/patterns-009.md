---
id: patterns-009
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["OOP", "Design Patterns", "Recursion"]
tags: ['patterns']
---

# What is the Composite Pattern?
Explain the Composite design pattern. In what scenarios would you apply it in a Java application?

---ANSWER---

The Composite pattern is a structural pattern that lets you compose objects into tree structures and then work with these structures as if they were individual objects.

It is applied when your core model can be represented as a tree. The pattern defines a common interface for both simple leaves and complex containers (composites). When a client calls a method on a composite, it delegates the request to its children, and so on down the tree.

A common scenario in Java is working with a file system where a `Directory` can contain both `Files` and other `Directories`. Another example is a UI framework where a `Panel` can contain `Buttons` and other `Panels`.

### Life Analogy
An army structure. An army consists of divisions, divisions consist of brigades, brigades consist of squads, and squads contain soldiers. Orders given to the top general are passed down the hierarchy to the individual soldiers, treating the whole hierarchy uniformly.

### Key Points
- Treats single objects and compositions of objects uniformly.
- Excellent for tree-like structures.
- Relies heavily on recursion.
