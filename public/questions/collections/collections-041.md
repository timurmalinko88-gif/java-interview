---
id: collections-041
topic: Collections
difficulty: Junior
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Iterators"]
tags: [oop, spring-core, stream-api, multithreading, collections, exceptions]
---

# ConcurrentModificationException
What causes a `ConcurrentModificationException` in Java collections?

---ANSWER---

A `ConcurrentModificationException` is thrown when a collection is structurally modified while an iterator is iterating over it, in a way that the iterator does not expect. 

"Structurally modified" means adding or removing elements (which changes the size or structure of the collection), not just modifying the value of an existing element.

This exception is the hallmark of **Fail-Fast** iterators (used by standard collections like `ArrayList`, `HashMap`, `HashSet`). 

It can happen in two primary scenarios:
1. **Multi-threaded**: Thread A is iterating over an `ArrayList` while Thread B adds an element to that same `ArrayList`.
2. **Single-threaded**: You are iterating over an `ArrayList` using a `for-each` loop (which internally uses an iterator) and you try to remove an element using `list.remove(element)`.

### Life Analogy
Imagine you are a teacher taking attendance by reading down a printed list of 30 students. If someone sneaks in and adds or deletes a name from the paper while you are reading it, your line counts and tracking get completely messed up. You throw your hands up in frustration (throw an exception).

### Key Points
- Thrown by fail-fast iterators.
- Triggered by structural modifications (add/remove).
- Happens in both single-threaded and multi-threaded scenarios.
