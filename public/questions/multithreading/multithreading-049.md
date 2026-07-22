---
id: multithreading-049
topic: Multithreading
difficulty: Middle
format: System Design
time: 5
frequency: 60%
source: Custom
prerequisites: ["Concurrency", "ThreadLocalRandom", "Math.random"]
tags: [oop, spring-core, system-design, memory, multithreading, collections]
---

# `ThreadLocalRandom` vs `Math.random()`
You are building a high-throughput simulation where 1,000 concurrent threads are constantly generating random numbers. Why should you avoid using `Math.random()` or a shared `java.util.Random` instance? What is the alternative?

---ANSWER---

You should avoid `Math.random()` (which internally uses a single, shared `java.util.Random` instance) in highly concurrent environments because of **lock contention**.

**The Problem:**
The `java.util.Random` class is thread-safe, but it achieves this by synchronizing the seed generation. Every time a thread requests a random number, it must update the internal seed value for the next generation. If 1,000 threads hit the same `Random` instance simultaneously, they all queue up on the internal lock, waiting for their turn to update the seed. This turns parallel execution into a massive sequential bottleneck.

**The Alternative: `ThreadLocalRandom`**
Introduced in Java 7, `ThreadLocalRandom` solves this by giving every thread its own isolated random number generator and seed. Because there is no shared state, there is absolutely no synchronization overhead or lock contention.

**Usage:**
```java
// Fast and lock-free
int randomNum = ThreadLocalRandom.current().nextInt(1, 100);
```

`ThreadLocalRandom` is buying a cheap pocket calculator for every single accountant. They can all calculate at the same time without waiting in line.

- Shared random generators cause severe lock contention under heavy concurrency.
- `ThreadLocalRandom.current()` provides lock-free, isolated random generation per thread.

### Life Analogy
`Math.random()` is like 1,000 accountants sharing a single, giant calculator in the center of the office. Only one person can punch numbers into it at a time.

### Key Points
- `Math.random()` and `java.util.Random` use synchronization to update a shared seed.
