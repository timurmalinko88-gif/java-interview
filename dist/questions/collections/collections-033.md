---
id: collections-033
topic: Collections
difficulty: Senior
format: Open Answer
time: 5
frequency: 20%
source: Custom
prerequisites: ["Concurrency"]
tags: ['collections']
---

# LinkedTransferQueue vs LinkedBlockingQueue
What is the difference between `LinkedTransferQueue` and `LinkedBlockingQueue`?

---ANSWER---

Both are thread-safe, linked-node queues from `java.util.concurrent`, but `LinkedTransferQueue` implements the `TransferQueue` interface, adding advanced hand-off capabilities.

**LinkedBlockingQueue:**
- Producers use `put(e)` to place an element in the queue. Once the element is in the queue, the Producer thread returns and moves on, regardless of whether a Consumer is ready to take it.

**LinkedTransferQueue:**
- Introduces the `transfer(e)` method. 
- When a Producer calls `transfer(e)`, the thread will **block** until a Consumer actually retrieves (`take` or `poll`) the element. It guarantees a direct hand-off from producer to consumer.
- It also supports `tryTransfer(e)`, which hands off the element only if a consumer is already waiting, otherwise returning false immediately without enqueuing.
- Internally, it is highly optimized (using CAS operations) and generally performs better than `LinkedBlockingQueue` even for standard queue operations.

### Life Analogy
`LinkedBlockingQueue` is like dropping a letter in a mailbox. You put it in, walk away, and assume the mailman will pick it up eventually. `LinkedTransferQueue` (`transfer` method) is like requiring a signature delivery. You hand the letter over, but you literally stand there waiting until the mailman physically takes it out of your hand before you are allowed to leave.

### Key Points
- `LinkedTransferQueue` supports guaranteed hand-offs via `transfer()`.
- `transfer()` blocks the producer until the consumer consumes the element.
- Generally higher performance due to dual-queue lock-free algorithms.
