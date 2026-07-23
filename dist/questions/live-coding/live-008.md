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

# Deadlock detection and fix
Our application occasionally freezes completely. We have two threads, `Thread1` and `Thread2`, that acquire locks on two shared resources, `ResourceA` and `ResourceB`, to perform a compound operation. 

Can you explain why the provided code causes a deadlock, how you would detect it in production, and rewrite the code to prevent the deadlock from happening?

---ANSWER---

A deadlock occurs when two or more threads are blocked forever, each waiting for a lock held by the other. 

In the buggy scenario, `Thread1` locks `ResourceA` and then tries to lock `ResourceB`. Simultaneously, `Thread2` locks `ResourceB` and then tries to lock `ResourceA`. If the timing is just right, `Thread1` holds A and waits for B, while `Thread2` holds B and waits for A. Neither can proceed, resulting in a deadlock.

**Detection:** In production, you can detect a deadlock by taking a thread dump using tools like `jstack <pid>`, Java VisualVM, or JConsole. The JVM is smart enough to analyze thread dependencies and explicitly print "Found one Java-level deadlock:" in the dump output.

**Fix:** The most common way to prevent deadlocks is to enforce a **strict global lock acquisition order**. If all threads in the system always acquire locks in the exact same order (e.g., always lock A before B), circular waiting is impossible, and deadlocks cannot occur.

### Examples
```java
// BUGGY CODE:
Object lockA = new Object();
Object lockB = new Object();

// Thread 1
synchronized (lockA) {
    Thread.sleep(50); // Simulating some work
    synchronized (lockB) {
        System.out.println("Thread 1 finished");
    }
}

// Thread 2
synchronized (lockB) {
    Thread.sleep(50); // Simulating some work
    synchronized (lockA) { // DEADLOCK HAPPENS HERE
        System.out.println("Thread 2 finished");
    }
}

// REFACTORED CODE:
Object lockA = new Object();
Object lockB = new Object();

// Thread 1
synchronized (lockA) {
    Thread.sleep(50); 
    synchronized (lockB) {
        System.out.println("Thread 1 finished");
    }
}

// Thread 2 (Lock order changed to match Thread 1!)
synchronized (lockA) { 
    Thread.sleep(50);
    synchronized (lockB) { 
        System.out.println("Thread 2 finished");
    }
}
```

### Life Analogy
Imagine a narrow bridge that only fits one car, with a gate at each end. Car 1 enters the North gate and waits for the South gate to open. Car 2 enters the South gate and waits for the North gate to open. They meet in the middle and stare at each other forever (deadlock). The fix? Make a rule: Everyone must enter through the North gate. Car 2 waits at the North gate behind Car 1. Car 1 crosses, opens the South gate, exits, and then Car 2 proceeds. Order restores peace.

### Key Points
- Deadlocks require mutual exclusion, hold and wait, no preemption, and circular wait.
- Breaking the "circular wait" condition by establishing a global lock order is the standard fix.
- Use `jstack` or JVM monitoring tools to find deadlocks in hanging applications.
