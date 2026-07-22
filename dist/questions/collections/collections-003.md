---
id: collections-003
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Hashing"]
tags: ['collections']
---

# HashMap vs HashTable
What are the differences between `HashMap` and `HashTable` in Java?

---ANSWER---

Both `HashMap` and `HashTable` implement the `Map` interface and store key-value pairs using hashing, but they have several key differences:

1. **Synchronization**: `HashTable` is synchronized, meaning it is thread-safe and can be shared between multiple threads. `HashMap` is not synchronized and is not thread-safe.
2. **Null keys and values**: `HashMap` allows one `null` key and any number of `null` values. `HashTable` does not allow `null` keys or `null` values (it will throw a `NullPointerException`).
3. **Performance**: Because `HashTable` is synchronized, it is generally slower than `HashMap` in a single-threaded environment.
4. **Legacy**: `HashTable` is a legacy class (introduced in JDK 1.0) that was later retrofitted to implement the `Map` interface. `HashMap` was introduced in the Java Collections Framework (JDK 1.2).

For thread-safe operations, `ConcurrentHashMap` is preferred over `HashTable` today.

### Life Analogy
Think of `HashTable` as a bank vault where only one teller (thread) is allowed to enter and do work at a time—it's secure but slow. Think of `HashMap` as an open office where everyone can do work at the same time—it's fast, but if two people try to update the same document at once, things get messed up.

### Key Points
- `HashTable` is synchronized, `HashMap` is not.
- `HashMap` allows nulls, `HashTable` does not.
- `HashTable` is considered legacy.
