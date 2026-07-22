---
id: multithreading-038
topic: Multithreading
difficulty: Junior
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "synchronized"]
tags: ['multithreading']
---

# `synchronized` Method vs Block
Review the two methods below. What is the functional difference between `methodA` and `methodB`? Which one is generally preferred and why?

```java
public class SyncExample {
    
    public synchronized void methodA() {
        // ... some non-critical setup ...
        // ... critical section ...
        // ... some non-critical cleanup ...
    }

    public void methodB() {
        // ... some non-critical setup ...
        synchronized(this) {
            // ... critical section ...
        }
        // ... some non-critical cleanup ...
    }
}
```

---ANSWER---

Functionally, in terms of the monitor lock acquired, they are identical. Both acquire the intrinsic lock of the current object instance (`this`).

**The Difference:**
- `methodA` (Synchronized Method) locks the object for the *entire duration* of the method execution.
- `methodB` (Synchronized Block) locks the object *only for the duration of the block*.

**Which is preferred:**
`methodB` (Synchronized Block) is generally preferred. 

In multithreading, you want to keep critical sections (the code holding the lock) as short as possible to minimize contention and maximize throughput. If `methodA` does heavy I/O or long calculations before or after the critical state mutation, it unnecessarily blocks all other threads from entering *any* synchronized method on that object. `methodB` allows multiple threads to execute the setup/cleanup concurrently, only forcing them to single-file through the actual critical section.

`methodB` is like walking into the bank (setup), waiting in line, locking the teller's window while you hand over the money (critical section), and then moving to the side to organize your wallet (cleanup) while the next person approaches the teller.

- Synchronized blocks allow for finer granularity.
- Keep locked critical sections as small as possible to maximize concurrency.

### Life Analogy
`methodA` is like locking the front door of the bank while you fill out your deposit slip at the counter, talk to the teller, and put your receipt in your wallet. Nobody else can even enter the bank.

### Key Points
- Both synchronize on `this`.
