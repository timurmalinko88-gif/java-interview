---
id: multithreading-037
topic: Multithreading
difficulty: Senior
format: Open Answer
time: 15
frequency: 45%
source: Custom
prerequisites: ["Concurrency", "Java Memory Model"]
tags: [oop, spring-core, system-design, databases, jvm, memory, multithreading]
---

# "Happens-Before" Relationship
What is the "Happens-Before" relationship in the Java Memory Model (JMM)? Give two examples of actions that establish a happens-before relationship.

---ANSWER---

The **"Happens-Before"** relationship is the core concept of the Java Memory Model that guarantees memory visibility and instruction ordering across different threads. 

In a multithreaded environment, compilers, JVMs, and CPUs are allowed to reorder instructions to optimize performance, as long as it doesn't change the semantics of a *single* thread. However, this reordering can cause massive problems across *multiple* threads (e.g., Thread A writes a variable, but Thread B reads the old value because the write was reordered or cached).

If Action X *happens-before* Action Y, the JMM guarantees that the results of Action X will be perfectly visible to Action Y, and Action X will completely execute before Action Y, regardless of the threads they run on.

**Examples of Happens-Before rules in Java:**
1. **Monitor Lock Rule**: An unlock on a monitor (exiting a `synchronized` block) *happens-before* every subsequent lock on that same monitor (entering a `synchronized` block on the same object). The thread entering the block will see everything the exiting thread did.
2. **Volatile Variable Rule**: A write to a `volatile` field *happens-before* every subsequent read of that same `volatile` field.
3. **Thread Start Rule**: A call to `Thread.start()` on a thread *happens-before* any action in the started thread.
4. **Thread Join Rule**: All actions in a thread *happen-before* any other thread successfully returns from a `join()` on that thread.

A "Happens-Before" rule is like binding the book. It strictly enforces that a reader (Thread B) will absolutely see the end of Chapter 1 *before* they can start reading Chapter 2, no matter how the printer printed the pages.

- Prevents unexpected behavior from compiler/CPU reordering.
- Exiting a synchronized block happens-before entering the same block.
- Writing a volatile variable happens-before reading it.

### Life Analogy
Imagine writing a book. The author writes Chapter 1, then Chapter 2. To the author (single thread), the order is guaranteed. However, if the pages are given to a printing press (CPU), they might print them out of order for efficiency.

### Key Points
- Defines memory visibility and instruction ordering across threads.
