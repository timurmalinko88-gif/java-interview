---
id: mcq-mt-002
topic: Multithreading
difficulty: Middle
format: MCQ
tags: ['multithreading', 'volatile']
---
What problem does the volatile keyword solve?

A. Provides atomicity for complex operations (e.g., increment)
B. Prevents Deadlock
C. Guarantees visibility of variable changes between threads
D. Increases thread pool size

---ANSWER---
**Correct answer: C**

### Key Points
- `volatile` solves the visibility problem of processor caches and prevents instruction reordering.
- It **does not guarantee atomicity** (for example, `i++` will not be thread-safe even with `volatile`).
