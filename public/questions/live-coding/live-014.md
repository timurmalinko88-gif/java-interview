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

### Problem

The classic Producer-Consumer problem using old `wait()` and `notifyAll()` is prone to errors, such as thread wakeups when they shouldn't be. 

**Legacy Code:**

```java
import java.util.LinkedList;
import java.util.Queue;

public class Broker {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int CAPACITY = 10;

    public synchronized void produce(int item) throws InterruptedException {
        while (queue.size() == CAPACITY) {
            wait();
        }
        queue.add(item);
        notifyAll();
    }

    public synchronized int consume() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        int item = queue.poll();
        notifyAll();
        return item;
    }
}
```

### Challenge
Refactor this code to use `ReentrantLock` and `Condition` variables for more granular and efficient thread signaling (signaling only producers when consuming, and only consumers when producing).

---

### Solution

**Explanation:**
Using a single intrinsic lock (`synchronized`) and `notifyAll()` wakes up *all* waiting threads (both producers and consumers), which is inefficient (Thundering Herd problem). By using `ReentrantLock` and two `Condition` variables (`notFull` and `notEmpty`), we can precisely signal only the necessary threads.

**Refactored Code:**

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class Broker {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int CAPACITY = 10;
    
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public void produce(int item) throws InterruptedException {
        lock.lock();
        try {
            while (queue.size() == CAPACITY) {
                notFull.await(); // wait until there is space
            }
            queue.add(item);
            notEmpty.signal(); // wake up one consumer
        } finally {
            lock.unlock();
        }
    }

    public int consume() throws InterruptedException {
        lock.lock();
        try {
            while (queue.isEmpty()) {
                notEmpty.await(); // wait until there is data
            }
            int item = queue.poll();
            notFull.signal(); // wake up one producer
            return item;
        } finally {
            lock.unlock();
        }
    }
}
```
