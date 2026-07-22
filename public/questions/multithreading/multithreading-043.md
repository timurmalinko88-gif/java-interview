---
id: multithreading-043
topic: Multithreading
difficulty: Senior
format: System Design
time: 8
frequency: 35%
source: Custom
prerequisites: ["Concurrency", "Phaser"]
tags: [oop, spring-core, system-design, databases, testing, multithreading]
---

# `Phaser` vs `CyclicBarrier` / `CountDownLatch`
Java 7 introduced the `Phaser` class. In what ways is a `Phaser` more flexible than both `CountDownLatch` and `CyclicBarrier`? Give a use case.

---ANSWER---

A `Phaser` is a highly flexible synchronization barrier that combines and expands upon the features of `CountDownLatch` and `CyclicBarrier`.

**Flexibility advantages over `CountDownLatch` (CDL) and `CyclicBarrier` (CB):**
1. **Dynamic Registration**: With CDL and CB, the number of waiting parties is fixed at creation time. With a `Phaser`, threads can dynamically register (`register()`) and deregister (`arriveAndDeregister()`) at runtime. This means the number of parties required to trip the barrier can change over time.
2. **Reusability**: Like a CB, a Phaser is cyclic (reusable across multiple phases). CDL is single-use.
3. **Flexible Arrival**: Threads can arrive at the barrier and wait (`arriveAndAwaitAdvance()`), similar to CB. However, a thread can also arrive and immediately proceed without waiting (`arrive()`), simply registering its completion of a phase, which is useful when a thread finishes its part but has other independent work to do.

**Use Case:**
A multi-stage build system (like Maven). 
Phase 1: Download dependencies. We don't know initially how many dependencies there are, so we dynamically `register()` a worker for each one found.
Phase 2: Compile. Once all downloads `arriveAndAwaitAdvance()`, the compile phase begins. Some compilation modules might fail and abort, so they `arriveAndDeregister()`, dynamically lowering the threshold needed to advance to Phase 3 (Testing). A `CyclicBarrier` would be deadlocked if a thread aborted without arriving.

`CyclicBarrier` is a group of 5 friends doing a pub crawl, waiting at the door of each pub for all 5 to finish their drinks.
`Phaser` is a fluid tour group. You start with 10 people at the museum. At the museum, 2 people leave the tour (deregister), and 3 new people join (register). The tour guide waits for the current count (11) before moving to the next stop.

- It is reusable across multiple phases (generations).
- Threads can arrive and wait, or arrive and proceed without waiting.
- Replaces both CDL and CB in complex, dynamic scenarios.

### Life Analogy
`CountDownLatch` is buying exactly 5 tickets to a movie; once 5 people arrive, you go in.

### Key Points
- `Phaser` supports dynamic registration and deregistration of parties.
