---
id: patterns-012
topic: Patterns
difficulty: Middle
format: Open Answer
time: 5
frequency: 45%
source: Custom
prerequisites: ["OOP", "Design Patterns", "Memory Management"]
tags: ['patterns']
---

# What is the Flyweight Pattern?
Describe the Flyweight design pattern. What is the difference between intrinsic and extrinsic state?

---ANSWER---

The Flyweight pattern is a structural pattern aimed at minimizing memory usage or computational expenses by sharing as much as possible with related objects. It is used when you need to create a massive number of objects that share identical state.

The key to the pattern is dividing object state into two parts:
1. **Intrinsic State**: State that is context-independent, immutable, and can be shared across many objects. This is stored inside the Flyweight object.
2. **Extrinsic State**: State that depends on the context, varies, and cannot be shared. This is passed to the Flyweight's methods by the client code when needed, rather than being stored inside the object.

A classic example in Java is the `String` pool, or the `Integer.valueOf()` cache, which reuses immutable objects.

### Life Analogy
A forest in a video game. Instead of creating a million distinct tree objects each with their own identical bark texture and leaf mesh in RAM (intrinsic state), you load one TreeModel. You then render it a million times by just passing different X/Y coordinates to the render engine (extrinsic state).

### Key Points
- Reduces memory consumption by sharing objects.
- Intrinsic state is shared and immutable.
- Extrinsic state is context-specific and passed in by the client.
