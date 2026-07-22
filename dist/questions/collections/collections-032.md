---
id: collections-032
topic: Collections
difficulty: Senior
format: Open Answer
time: 5
frequency: 30%
source: Custom
prerequisites: ["Concurrency"]
tags: ['collections']
---

# PriorityBlockingQueue
What is a `PriorityBlockingQueue` and how does it differ from a standard `PriorityQueue`?

---ANSWER---

`PriorityBlockingQueue` is an implementation of the `BlockingQueue` interface that orders elements according to their priority (just like `PriorityQueue`), but adds thread-safety and blocking operations.

**Differences from `PriorityQueue`:**
1. **Thread Safety**: `PriorityQueue` is not thread-safe. `PriorityBlockingQueue` uses a single `ReentrantLock` to control access to the underlying heap structure, making it safe for concurrent use.
2. **Blocking Operations**: It supports the `take()` method. If the queue is empty, a thread calling `take()` will block (wait) until another thread inserts an element.
3. **Unbounded**: `PriorityBlockingQueue` is an unbounded queue. It will dynamically grow its internal array as needed. Because it is unbounded, the `put()` method will never block (it might throw an `OutOfMemoryError` if you run out of heap, but it won't wait for space).

### Life Analogy
A standard `PriorityQueue` is an emergency room triage desk where only one nurse works. If two patients talk to her at exactly the same time, she gets confused (not thread-safe). A `PriorityBlockingQueue` has a queue line with a security guard (ReentrantLock) ensuring patients talk to the nurse one by one. If there are no patients, the doctor sleeps (`take` blocks) until the guard sends a patient in.

### Key Points
- Thread-safe version of `PriorityQueue`.
- Unbounded queue (put never blocks).
- `take()` blocks if the queue is empty.
- Uses a `ReentrantLock` for concurrency.
