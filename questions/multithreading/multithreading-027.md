---
id: multithreading-027
topic: Multithreading
difficulty: Middle
format: Open Answer
time: 7
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "ReentrantLock", "synchronized"]
tags: [oop, spring-core, memory, multithreading, collections, exceptions]
---

# `ReentrantLock` vs `synchronized`
What are the advantages of using a `ReentrantLock` over the intrinsic `synchronized` block?

---ANSWER---

Both `ReentrantLock` and `synchronized` provide mutual exclusion and thread-safety, but `ReentrantLock` (introduced in Java 5) offers advanced features that `synchronized` lacks:

1. **Try-Lock (Non-blocking):** `ReentrantLock` provides `tryLock()`. A thread can attempt to acquire the lock; if it's held by another thread, the method immediately returns `false` instead of blocking indefinitely, allowing the thread to do other work.
2. **Timed Lock:** `tryLock(long timeout, TimeUnit unit)` allows a thread to wait for a specific duration to acquire the lock before giving up.
3. **Interruptible Lock:** `lockInterruptibly()` allows a thread waiting to acquire a lock to be interrupted by another thread, throwing an `InterruptedException`. A thread blocked on a `synchronized` block cannot be interrupted.
4. **Fairness:** `ReentrantLock` can be constructed in "fair" mode (`new ReentrantLock(true)`). This guarantees that the lock is granted to the longest-waiting thread. `synchronized` is always unfair (no guaranteed order).
5. **Multiple Condition Variables:** A single `ReentrantLock` can have multiple `Condition` objects associated with it (`lock.newCondition()`), allowing finer-grained control over thread notification compared to the single `wait()/notify()` queue per object.

**Disadvantage:** `ReentrantLock` requires explicit locking and, most importantly, explicit unlocking in a `finally` block. Missing the unlock can cause permanent deadlocks.

`ReentrantLock` is a smart lock. You can knock and see if it's free, and leave if it isn't (`tryLock`). You can wait for exactly 5 minutes before leaving (`timed lock`). You can establish a queue so the person waiting the longest goes next (`fairness`).

- Supports timeouts and thread interruption while waiting.
- Supports fairness policies.
- Must be explicitly unlocked in a `finally` block.

### Life Analogy
`synchronized` is a basic bathroom lock. You wait outside blindly until the door opens.

### Key Points
- `ReentrantLock` offers non-blocking attempts (`tryLock`).
