---
id: multithreading-012
topic: Multithreading
difficulty: Middle
format: Code Review
time: 7
frequency: 75%
source: Custom
prerequisites: ["Concurrency", "volatile"]
tags: [testing, oop, spring-core, multithreading]
---

# `volatile` Keyword Misuse
Review the following code. Is it thread-safe? If not, explain why and how to fix it.

```java
public class Counter {
    private volatile int count = 0;

    public void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }
}
```

---ANSWER---

The code is **not thread-safe**. 

While the `volatile` keyword guarantees **visibility** (changes made by one thread are immediately visible to others), it does not guarantee **atomicity**. 

The operation `count++` is not atomic. It actually consists of three separate steps:
1. Read the current value of `count`.
2. Add 1 to the value.
3. Write the new value back to `count`.

If two threads execute `increment()` simultaneously, they might both read the same initial value (e.g., 5), increment it to 6, and write 6 back. The total count will be 6 instead of 7, resulting in a lost update.

To fix this, you can use one of the following approaches:
1. **Synchronization**: Make the `increment()` method `synchronized`.
2. **Atomic variables**: Use `AtomicInteger` instead of `volatile int`, and call `count.incrementAndGet()`.

- `count++` is a read-modify-write operation and is not atomic.
- Use `AtomicInteger` or `synchronized` for operations requiring atomicity.

### Life Analogy
`volatile` is like a shared whiteboard where everyone can see the latest numbers instantly. However, `count++` is like looking at a number, going back to your desk to do math, and returning to overwrite it. If two people look at the board at the same time and do the math at their desks, they might write the same result, ignoring each other's work.

### Key Points
- `volatile` guarantees visibility but not atomicity.
