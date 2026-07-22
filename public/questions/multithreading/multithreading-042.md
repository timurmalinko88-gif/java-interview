---
id: multithreading-042
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 3
frequency: 55%
source: Custom
prerequisites: ["Concurrency", "Thread Priority"]
tags: ['multithreading']
---

# Thread Priority
How does thread priority work in Java? Can you guarantee that a `MAX_PRIORITY` thread will always execute before a `MIN_PRIORITY` thread?

---ANSWER---

In Java, every thread has a priority represented by an integer from 1 (`Thread.MIN_PRIORITY`) to 10 (`Thread.MAX_PRIORITY`). The default priority is 5 (`Thread.NORM_PRIORITY`). You can change a thread's priority using `thread.setPriority(int)`.

**Can you guarantee execution order?**
**No.** Thread priority is merely a *hint* to the underlying operating system's thread scheduler. 

The JVM maps Java thread priorities to the native OS thread priorities. Different operating systems (Windows, Linux, macOS) have completely different thread scheduling algorithms and priority levels. Therefore:
1. A high-priority thread generally gets more CPU time than a low-priority thread, but it is not absolute.
2. A low-priority thread is not completely blocked from running (to prevent starvation), it just gets scheduled less frequently.
3. Behavior is highly platform-dependent.

You should **never** rely on thread priorities for program correctness or synchronization logic. They are only for performance tuning hints.

- Priority is a hint to the OS scheduler, not a strict rule.
- Execution order is not guaranteed.
- Application logic must not rely on thread priorities for correctness.

### Life Analogy
Thread priority is like putting a "FRAGILE: Handle with care" sticker on a package. It's a suggestion to the postal workers (the OS scheduler) to treat it carefully and prioritize it, but there is absolutely no legal guarantee they won't toss it in the back of the truck along with the normal packages.

### Key Points
- Priorities range from 1 to 10 (default 5).
