---
id: live-014
path: questions/live-coding/live-014.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Producer-Consumer with wait/notify vs ReentrantLock
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

# Producer-Consumer with wait/notify vs ReentrantLock
We have a Producer-Consumer implementation using the legacy `Object.wait()` and `Object.notifyAll()` methods on a shared `LinkedList`. It works, but it's inefficient because `notifyAll()` wakes up *all* threads (both producers and consumers), leading to high context-switching overhead (the "thundering herd" problem).

Can you refactor this using `java.util.concurrent.locks.ReentrantLock` and its `Condition` variables to explicitly signal only producers when the queue is empty, and only consumers when the queue is full?

---ANSWER---

The intrinsic monitor lock (using `synchronized` and `wait/notify`) only provides a single wait-set per object. This means `notifyAll()` blindly wakes up every thread waiting on that object. If a Producer puts an item in the queue, it should ideally only wake up a Consumer. Waking up other Producers is a waste of CPU cycles, as they will just find the queue is still full and go back to sleep.

`ReentrantLock` solves this by allowing multiple `Condition` variables per lock. We can create one condition for `notFull` (where Producers wait) and one for `notEmpty` (where Consumers wait).
When a Producer adds an item, it signals specifically the `notEmpty` condition. Only a waiting Consumer wakes up. This targeted signaling is much more efficient under high contention.

*(Note: In real-world code, just use `BlockingQueue`. This exercise tests understanding of low-level concurrency constructs).*

### Examples
```java
// BUGGY CODE (Inefficient single wait-set):
public synchronized void produce(int val) throws InterruptedException {
    while (queue.size() == MAX) {
        wait();
    }
    queue.add(val);
    notifyAll(); // Wakes up BOTH producers and consumers unnecessarily
}

// REFACTORED CODE (Targeted signaling with Conditions):
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class BoundedBuffer {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int MAX = 10;
    
    private final Lock lock = new ReentrantLock();
    // Two separate wait-sets!
    private final Condition notFull  = lock.newCondition(); 
    private final Condition notEmpty = lock.newCondition(); 

    public void produce(int val) throws InterruptedException {
        lock.lock();
        try {
            while (queue.size() == MAX) {
                notFull.await(); // Wait here if full
            }
            queue.add(val);
            notEmpty.signal(); // Signal ONLY a waiting consumer
        } finally {
            lock.unlock(); // Always unlock in a finally block!
        }
    }

    public int consume() throws InterruptedException {
        lock.lock();
        try {
            while (queue.isEmpty()) {
                notEmpty.await(); // Wait here if empty
            }
            int val = queue.poll();
            notFull.signal(); // Signal ONLY a waiting producer
            return val;
        } finally {
            lock.unlock();
        }
    }
}
```

### Life Analogy
Using `notifyAll()` is like a restaurant manager yelling "ORDER READY!" through a megaphone into a crowded lobby of both chefs and delivery drivers. Everyone stops what they're doing to check, but only one driver actually needs it.
Using `Condition` variables is like the manager having two separate pagers: one just for chefs and one just for drivers. When food is ready, they page exactly one driver. The chefs keep working undisturbed.

### Key Points
- `ReentrantLock` provides more flexibility than `synchronized` blocks.
- Multiple `Condition` variables allow you to partition wait-sets, preventing the "thundering herd" problem.
- Always release a `ReentrantLock` in a `finally` block to prevent deadlocks in case of an exception.
