---
id: multithreading-001
topic: Multithreading
difficulty: Junior
format: Open Answer
estimated_time_minutes: 5
frequency: High
related_questions: [Difference between volatile and synchronized, What is happens-before]
source: Custom
prerequisites: [Basic understanding of threads, volatile keyword]
tags: [spring-core, memory, multithreading]
---

You have a user profile view counter implemented as follows:

```java
private volatile int views = 0;
```

Multiple threads simultaneously call a method that executes `views++`. What will happen to the counter's value under high load? If `volatile` is not suitable for this task, what is it actually used for? Provide an example of its correct usage.

---ANSWER---

Under high load, **the counter will lose some increments**. The `views++` operation is not atomic. Under the hood, it is broken down into three steps:

* Reading the current value of `views` from memory.
* Incrementing the value by 1.
* Writing the new value back to memory.

`volatile` only guarantees **visibility** of changes to other threads (it prevents caching the variable in processor registers), but it **does not provide atomicity**. Two threads can read the same value simultaneously, increment it, and write it back, overwriting each other's result (race condition).

**How to fix it:** Use `AtomicInteger` (or `LongAdder` for very high contention) or a `synchronized` block.

**What `volatile` is used for:** It is perfectly suited for state flag variables when one thread writes and others only read. For example, a background process stop flag:

```java
private volatile boolean isRunning = true;
```

* The increment operation `++` is not atomic (consists of 3 steps: read-modify-write).
* For counters in a multithreaded environment, you should use `AtomicInteger` / `AtomicLong` or `LongAdder`.
* The correct use case for `volatile` is boolean stop/signal flags (one writer, many readers).

### Life Analogy

Imagine a school chalkboard (this is main memory). `volatile` means that students always look at the board itself, not in their notebooks. But if two students run to the board at the same time, see the number "5", both mentally add "1", and simultaneously write "6" — one action will be lost. It should have become "7", but due to a lack of coordination (atomicity), it resulted in "6".

### Key Points
* `volatile` solves the visibility problem, but does not solve the atomicity problem of operations.
