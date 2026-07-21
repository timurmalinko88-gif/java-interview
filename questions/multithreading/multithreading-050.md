---
id: multithreading-050
topic: Multithreading
difficulty: Senior
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "ReentrantLock", "Exceptions"]
tags: [oop, spring-core, memory, multithreading, exceptions]
---

# `lock()` Position inside `try` Block
Review the following code using `ReentrantLock`. There is a subtle but critical flaw in the placement of `lock.lock()`. What is it, and why is it dangerous?

```java
public class LockReview {
    private final Lock lock = new ReentrantLock();

    public void doWork() {
        try {
            lock.lock(); 
            // ... perform operations ...
        } finally {
            lock.unlock();
        }
    }
}
```

---ANSWER---

The critical flaw is that **`lock.lock()` is placed *inside* the `try` block.** It should be placed immediately *before* the `try` block.

**Why it's dangerous:**
If the `lock.lock()` method throws an unchecked exception (e.g., an `OutOfMemoryError` or some internal `Error` within the AQS framework) *before* the lock is successfully acquired, the execution will jump straight to the `finally` block. 
The `finally` block will blindly attempt to call `lock.unlock()`. 
Because the thread does not actually own the lock (it failed to acquire it), `lock.unlock()` will throw an `IllegalMonitorStateException`. 

This masks the original, highly important error (like OOM) with a less helpful `IllegalMonitorStateException`, making debugging incredibly difficult in production.

**Fix:**
Always call `lock()` outside the try block.

```java
public void doWork() {
    lock.lock(); 
    try {
        // ... perform operations ...
    } finally {
        lock.unlock(); // Guaranteed to only unlock if acquisition succeeded
    }
}
```

Putting `lock()` outside the `try` is putting the parachute on *before* jumping. If the zipper is stuck, you just stay safely in the plane.

- If placed inside, a failed lock acquisition will trigger an `IllegalMonitorStateException` in the `finally` block.
- Secondary exceptions in `finally` blocks mask the original, critical exception.

### Life Analogy
Putting `lock()` inside the `try` is like trying to put on a parachute (lock) *while* jumping out of the plane (try block). If the parachute gets stuck in the bag, you still hit the ground (finally block) and try to pull the cord on a parachute you aren't wearing, causing a secondary error.

### Key Points
- Always place `lock.lock()` immediately *before* the `try` block.
