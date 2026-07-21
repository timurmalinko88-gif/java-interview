---
id: stream-016
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["Stream API"]
---

# The peek() Operation
Explain the `peek()` operation in the Stream API. What is its primary use case, and what are the caveats when using it?

---ANSWER---

`peek()` is an intermediate operation that takes a `Consumer` and performs an action on each element as it flows through the pipeline, returning the stream unmodified.

**Primary Use Case:**
It exists mainly to support **debugging**, allowing you to see the elements as they flow past a certain point in a pipeline.

Example:
```java
List<String> list = Stream.of("one", "two", "three", "four")
    .filter(e -> e.length() > 3)
    .peek(e -> System.out.println("Filtered value: " + e))
    .map(String::toUpperCase)
    .peek(e -> System.out.println("Mapped value: " + e))
    .collect(Collectors.toList());
```

**Caveats & Dangers:**
1. **Side-effects:** While you technically can use `peek()` to modify the state of the objects in the stream (if they are mutable), it is strongly discouraged by the Java documentation. Streams should ideally be side-effect free. If you need to apply a side-effect, use `forEach()`.
2. **Optimization omissions:** In Java 9 and later, the JVM may optimize away `peek()` calls entirely if the stream size can be determined without processing the elements (e.g., when doing `.count()` on an upstream that doesn't change the size). Do not rely on `peek()` for business logic execution.

### Life Analogy
`peek()` is like a glass window on a factory conveyor belt. It lets the factory manager watch the products go by (for inspection/debugging) without stopping or altering the belt. If the manager reaches in through the window to paint a toy (side-effect), it violates safety rules.

### Key Points
- `peek()` is an intermediate operation used mostly for debugging.
- It should not be used to apply side-effects or mutate data.
- The JVM is allowed to skip `peek()` operations in certain optimization scenarios.
