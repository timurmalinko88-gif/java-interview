---
id: collections-016
topic: Collections
difficulty: Senior
format: Open Answer
time: 10
frequency: 50%
source: Custom
prerequisites: ["Garbage Collection", "Hashing"]
tags: [oop, spring-core, system-design, stream-api, memory, multithreading, collections]
---

# WeakHashMap
What is a `WeakHashMap` and when would you use it?

---ANSWER---

A `WeakHashMap` is a special implementation of the `Map` interface where the keys are stored as **Weak References**. 

In a standard `HashMap`, as long as the map holds a reference to a key, the Garbage Collector (GC) will not reclaim that key object, even if there are no other references to it in the application. This can lead to memory leaks if used for caching without a proper eviction policy.

In a `WeakHashMap`, if a key is no longer strongly referenced by any other part of the application, the GC is allowed to reclaim it. When the GC collects the key, the `WeakHashMap` automatically removes the entire key-value entry from the map.

**Use cases**: It is primarily used for cache implementations or keeping metadata associated with an object whose lifecycle is managed elsewhere (e.g., maintaining thread-local variables or storing object proxies).

### Life Analogy
Imagine holding a balloon on a string. A `HashMap` ties the string to your wrist—even if you forget about the balloon, it stays with you forever. A `WeakHashMap` means you lightly pinch the string with your fingers. As long as someone else is also holding it, you hold on too. But if everyone else lets go, the balloon flies away (garbage collected), and you simply forget you ever had it.

### Key Points
- Keys are stored as Weak References.
- Entries are automatically removed when the key is Garbage Collected.
- Excellent for memory-sensitive caches and metadata maps.
