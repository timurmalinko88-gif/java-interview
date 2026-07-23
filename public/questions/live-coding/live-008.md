---
id: live-008
path: questions/live-coding/live-008.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Deadlock detection and fix
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

The following code causes a deadlock intermittently when executed by multiple threads.

**Buggy Code:**

```java
public class ResourceManager {
    private final Object resourceA = new Object();
    private final Object resourceB = new Object();

    public void processAtoB() {
        synchronized (resourceA) {
            // simulate some work
            try { Thread.sleep(50); } catch (InterruptedException e) {}
            
            synchronized (resourceB) {
                System.out.println("Processing A then B");
            }
        }
    }

    public void processBtoA() {
        synchronized (resourceB) {
            // simulate some work
            try { Thread.sleep(50); } catch (InterruptedException e) {}
            
            synchronized (resourceA) {
                System.out.println("Processing B then A");
            }
        }
    }
}
```

### Challenge
Explain why the deadlock occurs and refactor the code to eliminate the deadlock without using `ReentrantLock.tryLock()`.

---

### Solution

**Explanation:**
A deadlock occurs when two or more threads are blocked forever, waiting for each other. 
If Thread 1 calls `processAtoB()` and acquires `resourceA`, and at the same time Thread 2 calls `processBtoA()` and acquires `resourceB`, both threads will block. Thread 1 will wait for `resourceB` (held by Thread 2), and Thread 2 will wait for `resourceA` (held by Thread 1).
The simplest way to avoid deadlock is to always acquire multiple locks in a global, strict order.

**Refactored Code:**
By locking `resourceA` and then `resourceB` in both methods, we eliminate the circular wait condition.

```java
public class ResourceManager {
    private final Object resourceA = new Object();
    private final Object resourceB = new Object();

    public void processAtoB() {
        synchronized (resourceA) {
            // simulate some work
            try { Thread.sleep(50); } catch (InterruptedException e) {}
            
            synchronized (resourceB) {
                System.out.println("Processing A then B");
            }
        }
    }

    public void processBtoA() {
        // FIX: Acquire locks in the same order (resourceA then resourceB)
        synchronized (resourceA) {
            synchronized (resourceB) {
                // simulate some work
                try { Thread.sleep(50); } catch (InterruptedException e) {}
                
                System.out.println("Processing B then A");
            }
        }
    }
}
```
