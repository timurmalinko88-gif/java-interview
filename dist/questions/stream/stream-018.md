---
id: stream-018
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Stream API"]
tags: [oop, spring-core, stream-api, memory, collections, exceptions]
---

# Collecting to Unmodifiable Lists
Before Java 16, `Collectors.toList()` was the standard way to collect stream results. In Java 16, a new method `Stream.toList()` was introduced, and Java 10 introduced `Collectors.toUnmodifiableList()`. What are the differences between these approaches?

---ANSWER---

Collecting data from a stream to a List has evolved over Java versions, specifically regarding mutability and null-safety.

**1. `collect(Collectors.toList())` (Java 8+)**
- Returns an implementation of `List` (usually `ArrayList`, but not guaranteed by specification).
- The resulting list is **mutable** (you can add/remove elements).
- Allows `null` elements.

**2. `collect(Collectors.toUnmodifiableList())` (Java 10+)**
- Returns a truly **unmodifiable** list.
- Throws `UnsupportedOperationException` if you try to mutate it.
- **Does not allow `null` elements**. If the stream contains nulls, it will throw a `NullPointerException`.

**3. `Stream.toList()` (Java 16+)**
- A direct terminal method on the Stream interface, skipping the `collect` syntax (shorter and cleaner).
- Returns an **unmodifiable** list.
- **Does allow `null` elements**.
- More memory efficient than the collector approach because it is directly integrated into the Stream internals.

### Life Analogy
- `Collectors.toList()` is like putting your collected coins in a generic piggy bank where you can still put coins in or take them out later.
- `Collectors.toUnmodifiableList()` is like sealing those coins in a display case; they can never be touched again, and the display case refuses to hold empty air (nulls).
- `Stream.toList()` is like a modernized, more efficient display case that is permanently sealed but forgiving enough to hold empty air.

### Key Points
- Use `Stream.toList()` in modern Java (16+) for concise, unmodifiable results.
- `Collectors.toList()` is the classic approach and returns mutable lists.
- `toUnmodifiableList()` rejects nulls, while `Stream.toList()` accepts them.
