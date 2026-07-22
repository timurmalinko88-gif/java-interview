---
id: patterns-010
topic: Patterns
difficulty: Middle
format: Code Review
time: 10
frequency: 90%
source: Custom
prerequisites: ["OOP", "Design Patterns", "Java I/O"]
tags: ['patterns']
---

# The Decorator Pattern and Java I/O
How does the Decorator pattern work? Provide an example of where it is heavily used in the standard Java API.

---ANSWER---

The Decorator pattern is a structural pattern that lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors. It provides a flexible alternative to subclassing for extending functionality dynamically at runtime.

It works by creating a decorator class that implements the same interface as the wrapped object and holds a reference to it. The decorator delegates calls to the wrapped object, but can add its own behavior before or after the call.

It is heavily used in the **`java.io`** package. For example, to read a file with buffering, you wrap a `FileReader` in a `BufferedReader`:
`Reader reader = new BufferedReader(new FileReader("file.txt"));`
Here, `BufferedReader` decorates `FileReader` with buffering capabilities without altering the `FileReader` class itself.

### Life Analogy
Wearing clothes. You are the base component. If it's cold, you wrap yourself in a sweater (a decorator). If it rains, you wrap the sweater in a raincoat (another decorator). Your core interface (being a person) doesn't change, but your behavior (handling weather) does.

### Key Points
- Adds behavior dynamically without subclassing.
- Favors composition over inheritance.
- Extensively used in `java.io` Input/Output streams.
