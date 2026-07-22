---
id: multithreading-045
topic: Multithreading
difficulty: Junior
format: Code Review
time: 4
frequency: 45%
source: Custom
prerequisites: ["Concurrency", "Thread.yield"]
tags: ['multithreading']
---

# `Thread.yield()`
Review the following run method. What is the intended purpose of `Thread.yield()`, and does it guarantee the thread will stop running?

```java
public void run() {
    for (int i = 0; i < 1000; i++) {
        System.out.println("Processing " + i);
        if (i % 100 == 0) {
            Thread.yield();
        }
    }
}
```

---ANSWER---

The intended purpose of `Thread.yield()` is to act as a hint to the thread scheduler that the current thread is willing to temporarily pause its execution and yield its current use of a processor to other threads of the same or higher priority.

**Does it guarantee the thread will stop running?**
**No.** Like thread priority, `yield()` is purely a heuristic hint to the OS scheduler. 

When a thread calls `yield()`, it transitions from the **Running** state back to the **Runnable** state. However, the OS scheduler might immediately select this exact same thread to run again in the very next scheduling cycle. Furthermore, on some operating systems or JVM implementations, `yield()` might do absolutely nothing at all. 

It does not put the thread to sleep, it does not release any locks (if called inside a synchronized block), and it provides no guarantees. It is rarely used in modern Java application code, mostly finding use in debugging or testing concurrency to force context switches and expose race conditions.

- It transitions the thread from Running to Runnable.
- It provides zero guarantees and might be completely ignored.
- It does not release locks.

### Life Analogy
Imagine you are speaking at a town hall meeting (holding the CPU). Calling `Thread.yield()` is like saying, "I'm willing to let someone else speak for a minute if they want to." If someone else is waiting at the microphone, they might take over. But if no one else wants to speak, or the moderator (scheduler) decides your topic is too important, they will tell you to just keep talking.

### Key Points
- `yield()` is a hint to the scheduler to let other threads run.
