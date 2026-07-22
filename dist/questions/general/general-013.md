---
id: general-013
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Core Java", "Strings", "Concurrency"]
tags: []
---

# StringBuilder vs StringBuffer

Both `StringBuilder` and `StringBuffer` are used to manipulate strings without creating new objects for every modification. What is the key difference between them, and when should you choose one over the other?

---ANSWER---

The primary difference between `StringBuffer` and `StringBuilder` is **thread safety**.

**StringBuffer:**
- Introduced in Java 1.0.
- All its major methods (`append()`, `insert()`, `delete()`) are synchronized.
- This means it is **thread-safe**. Multiple threads can safely modify a `StringBuffer` instance without data corruption.
- However, synchronization introduces a performance overhead (locking and unlocking).

**StringBuilder:**
- Introduced in Java 1.5 as a drop-in replacement for `StringBuffer`.
- Its methods are **not synchronized**.
- It is **not thread-safe**.
- Because it lacks the synchronization overhead, it is significantly **faster** and more efficient than `StringBuffer`.

**Which to choose?**
In the vast majority of Java applications, string manipulation happens within a single thread (e.g., building a query string inside a method). Therefore, you should almost always default to using **`StringBuilder`** for better performance. 

You should only use `StringBuffer` in the rare scenario where a single string builder instance is shared and mutated across multiple concurrent threads (which is generally a bad design pattern anyway).

### Life Analogy
Imagine a shared whiteboard where you are writing a list. 
**StringBuffer** is like a room with a strict bouncer at the door. Only one person can enter, write a word, and leave before the next person is allowed in. It's safe, but slow if there's a line.
**StringBuilder** is like an unguarded whiteboard. If you are the only one in the room (single-threaded), you can write incredibly fast. But if three people try to write at the same time (multi-threaded), their markers will collide, and the text will be an illegible mess.

### Key Points
- `StringBuffer` is synchronized and thread-safe, but slower.
- `StringBuilder` is unsynchronized, not thread-safe, but faster.
- Always prefer `StringBuilder` unless you strictly require thread-safe string mutation.
