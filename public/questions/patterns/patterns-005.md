---
id: patterns-005
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: [oop, spring-core, system-design, patterns, stream-api, collections, exceptions]
---

# What is the Builder Pattern?
Explain the Builder pattern. Why is it useful in Java, particularly when dealing with classes having many fields?

---ANSWER---

The Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations. 

In Java, it is especially useful for classes with many constructor parameters (especially optional ones). Without the Builder pattern, you might end up with the "Telescoping Constructor Anti-pattern" (multiple constructors with increasing numbers of parameters), or relying on many setter methods which can leave the object in an inconsistent state during initialization.

A Builder provides a fluent interface to set properties step-by-step and finally returns the fully constructed, often immutable, object via a `build()` method.

### Life Analogy
Ordering a custom sandwich at Subway. You don't ask for a "Sandwich with ham, cheese, no lettuce, extra mayo, and pickles" in one breath (a huge constructor). Instead, you step through the process: "I want ham... add cheese... skip lettuce...", and finally say "That's it" (the `build()` step).

### Key Points
- Solves the telescoping constructor problem.
- Excellent for creating immutable objects.
- Makes object creation code highly readable.
