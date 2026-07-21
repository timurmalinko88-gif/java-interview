---
id: collections-009
topic: Collections
difficulty: Senior
format: Open Answer
time: 10
frequency: 85%
source: Custom
prerequisites: ["Concurrency"]
---

# Fail-Fast vs Fail-Safe Iterators
What is the difference between Fail-Fast and Fail-Safe iterators in Java? Give examples of collections that use each.

---ANSWER---

These concepts describe how iterators behave when the underlying collection is modified structurally (elements added or removed) during iteration by another thread or even the same thread outside the iterator's own `remove()` method.

**Fail-Fast Iterators:**
- Immediately throw a `ConcurrentModificationException` if the collection is structurally modified during iteration.
- They operate directly on the collection. They maintain a `modCount` variable. If the collection's modification count changes during iteration, it fails.
- Examples: `ArrayList`, `HashMap`, `HashSet` (collections in the `java.util` package).

**Fail-Safe (Weakly Consistent) Iterators:**
- Do not throw `ConcurrentModificationException`. 
- They operate on a clone/copy of the collection or use concurrent data structures (like lock-free nodes). Because they work on a copy or a snapshot, modifications made after the iterator is created might not be visible.
- Examples: `CopyOnWriteArrayList`, `ConcurrentHashMap` (collections in the `java.util.concurrent` package).

### Life Analogy
**Fail-Fast:** You are reading a book, and someone rips a page out while you are reading. You immediately stop and yell (throw an exception).
**Fail-Safe:** You photocopy the book and read the copy. If someone rips a page out of the original book, you don't care because your copy is safe (but you might be reading outdated information).

### Key Points
- Fail-fast throws `ConcurrentModificationException` on structural changes.
- Fail-fast operates directly on the collection using a modCount.
- Fail-safe operates on a copy or snapshot and does not throw the exception.
