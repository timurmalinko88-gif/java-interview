---
id: stream-004
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Core Java"]
tags: ['stream-api']
---

# What is an Optional and how does it prevent NullPointerException?
Explain the purpose of `java.util.Optional` introduced in Java 8. How does it change the way developers handle potential null values?

---ANSWER---

`Optional<T>` is a container object that may or may not contain a non-null value. It was introduced to address the "Billion Dollar Mistake"—the `NullPointerException` (NPE).

Before Java 8, methods that couldn't return a valid value would typically return `null`. Callers often forgot to check for `null`, leading to runtime crashes. 

By returning `Optional<T>` instead of `T`, a method explicitly forces the caller to acknowledge that the result might be absent. It provides a fluent, functional API to handle the presence or absence of a value safely, reducing the need for explicit `if (obj != null)` checks.

Key methods include:
- `isPresent()` / `isEmpty()`: Check if value exists.
- `ifPresent(Consumer)`: Execute code only if the value exists.
- `orElse(T)`: Return a default value if empty.
- `orElseThrow()`: Throw an exception if empty.
- `map()`, `filter()`: Transform or filter the wrapped value functionally.

### Life Analogy
Think of a method returning `Optional` like ordering a physical product online and receiving a locked delivery box instead of just the item. 
The box might contain your item, or it might be empty (out of stock). You can't just blindly use the item; you must first open the box and check. `Optional` is the box that forces you to handle the "empty" scenario properly instead of accidentally grabbing thin air and hurting yourself.

### Key Points
- `Optional` is a wrapper class indicating the presence or absence of a value.
- It reduces the likelihood of `NullPointerException`.
- It forces API consumers to explicitly handle the "no result" case.
- It should primarily be used as a return type, not as a field type or method parameter.
