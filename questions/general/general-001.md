---
id: general-001
topic: General
format: Code Review
level: Middle
tags: [oop, spring-core, multithreading]
---

Find the bug in the following code and explain how to fix it:

```java
public class Counter {
    private int count = 0;

    public void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }
}
```

---ANSWER---

**Problem:** 
The `count++` operation is not atomic. It consists of three hidden steps:
1. Reading the current value.
2. Incrementing by 1.
3. Writing the new value.
If multiple threads call `increment()` simultaneously, a "race condition" will occur, and some increments will be lost.

**How to fix it:**
For simple counters, it is best to use the `AtomicInteger` class:

```java
import java.util.concurrent.atomic.AtomicInteger;

public class Counter {
    private AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        count.incrementAndGet();
    }

    public int getCount() {
        return count.get();
    }
}
```
*Alternative:* add the `synchronized` keyword to the `increment()` method, but this might run slower with a large number of threads.

