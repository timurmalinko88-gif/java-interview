---
id: collections-019
topic: Collections
difficulty: Middle
format: Open Answer
time: 10
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "Hashing"]
tags: [oop, spring-core, stream-api, memory, multithreading, collections]
---

# SynchronizedMap vs ConcurrentHashMap
What is the difference between `Collections.synchronizedMap()` and `ConcurrentHashMap`?

---ANSWER---

Both provide thread-safe maps, but they achieve it differently, leading to drastically different performance profiles in concurrent environments.

1. **Collections.synchronizedMap(map)**:
   - This wrapper uses an object-level lock (usually the map object itself). 
   - Every single method (`get`, `put`, `remove`) is synchronized on this one lock.
   - If Thread A is reading (`get`), Thread B cannot read or write at the same time. The entire map is blocked.

2. **ConcurrentHashMap**:
   - Uses finer-grained locking (lock striping in Java 7, CAS + bucket node locking in Java 8+).
   - Only the specific bucket being modified is locked during a write operation.
   - Read operations (`get`) do not require locking at all.
   - Multiple threads can read and write simultaneously as long as they are touching different buckets.

**Rule of thumb:** Always prefer `ConcurrentHashMap` for high-concurrency environments.

### Life Analogy
`SynchronizedMap` is a public bathroom with one door for the entire building—only one person can go inside to use any sink or stall at a time. `ConcurrentHashMap` is a bathroom with individual stalls—multiple people can use different stalls simultaneously without blocking each other.

### Key Points
- `SynchronizedMap` locks the entire collection on every operation.
- `ConcurrentHashMap` locks only at the bucket level (or uses lock-free operations).
- `ConcurrentHashMap` allows concurrent reads and writes, vastly improving throughput.
