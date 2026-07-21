---
id: stream-027
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Stream API"]
tags: [spring-core, patterns, stream-api, exceptions, collections]
---

# Stream.ofNullable()
What is `Stream.ofNullable()` (introduced in Java 9), and what problem does it solve?

---ANSWER---

`Stream.ofNullable(T t)` is a static factory method that returns a sequential Stream containing a single element if the provided value is non-null. If the provided value is null, it returns an empty Stream.

**Problem it solves:**
Before Java 9, dealing with collections or method calls that could return null within a `flatMap` operation was tedious. You had to explicitly check for null to avoid `NullPointerException`s.

Before Java 9:
```java
// If getManager() can return null:
employees.stream()
    .flatMap(e -> e.getManager() != null ? Stream.of(e.getManager()) : Stream.empty())
    // ...
```

With Java 9 `Stream.ofNullable()`:
```java
employees.stream()
    .flatMap(e -> Stream.ofNullable(e.getManager()))
    // ...
```
This cleanly filters out nulls and flattens the non-null elements into the stream pipeline without explicit `if` statements or ternary operators.

### Life Analogy
`Stream.ofNullable` is like an automatic mail sorter. If an envelope (value) is handed to it, it places it on the conveyor belt. If it's handed literal empty air (null), it just ignores it and keeps the belt moving, rather than shutting down the whole factory (NPE).

### Key Points
- Introduced in Java 9.
- Returns a 1-element stream if non-null, or an empty stream if null.
- Extremely useful inside `flatMap` to eliminate null checks.
