---
id: multithreading-007
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 3
frequency: 80%
source: Custom
prerequisites: ["Synchronization", "Deadlocks"]
tags: ['multithreading']
---

# Understanding Deadlocks

What is a deadlock in Java multithreading, and what are some common strategies to prevent it?

---ANSWER---

A **deadlock** occurs when two or more threads are blocked forever, waiting for each other to release a resource (such as a monitor lock). Because each thread holds a lock that the other thread needs, and neither will release their lock until they acquire the other, they remain stuck indefinitely.

**Conditions for Deadlock (Coffman Conditions):**
1. Mutual Exclusion (resources cannot be shared).
2. Hold and Wait (threads hold resources while waiting for others).
3. No Preemption (resources cannot be forcefully taken away).
4. Circular Wait (a circular chain of threads waiting on each other).

**How to avoid deadlocks:**
- **Lock Ordering:** The most common and effective strategy. Always acquire multiple locks in the exact same order across all threads. If Thread A and Thread B always lock Resource 1 before Resource 2, a deadlock cannot occur.
- **Lock Timeout:** Use `java.util.concurrent.locks.Lock.tryLock(long timeout, TimeUnit unit)`. If a thread cannot acquire all necessary locks within a given timeframe, it backs off, releases its current locks, and tries again later.
- **Minimize Lock Scope:** Keep synchronized blocks as small as possible and avoid calling unknown/alien methods while holding a lock.

- The most practical way to prevent deadlocks is strict **Lock Ordering**.
- Alternatively, using `tryLock()` with timeouts can help threads recover from potential deadlocks.
- Keep locked sections as short and simple as possible to minimize risk.

### Life Analogy
Imagine a narrow bridge where two cars meet head-on. Car A will not reverse until Car B moves, and Car B will not reverse until Car A moves. Both drivers sit there forever. To prevent this, a rule (Lock Ordering) could be established: "Cars heading North always have the right of way, so Southbound cars must wait."

### Key Points
- Deadlock happens when threads wait endlessly for locks held by each other.
