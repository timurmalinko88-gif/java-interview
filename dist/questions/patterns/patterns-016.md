---
id: patterns-016
topic: Patterns
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["OOP", "Data Structures"]
tags: [oop, spring-core, system-design, patterns, stream-api, memory, collections]
---

# What is the Iterator Pattern?
Explain the Iterator design pattern. How is it fundamentally integrated into the Java Collections Framework?

---ANSWER---

The Iterator pattern is a behavioral pattern that lets you traverse elements of a collection without exposing its underlying representation (list, stack, tree, etc.).

It extracts the traversal behavior of a collection into a separate object called an iterator. This iterator provides methods to fetch the next element and check if there are more elements.

In Java, this is deeply integrated via the `java.util.Iterator` and `java.lang.Iterable` interfaces. Any class that implements `Iterable` can be used in an enhanced `for` loop (for-each loop). This means Java developers use the Iterator pattern constantly, often without even thinking about it, allowing them to iterate over an `ArrayList` or a `HashSet` using the exact same loop syntax.

### Life Analogy
Watching TV. You don't need to know how the cable company stores or transmits the channels. You just use your remote control (the Iterator) to press "Next Channel" or "Previous Channel".

### Key Points
- Traverses collections without exposing internals.
- Core to Java's `Iterable` and `Iterator` interfaces.
- Powers the enhanced `for` loop in Java.
