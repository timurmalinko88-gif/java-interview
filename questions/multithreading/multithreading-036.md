---
id: multithreading-036
topic: Multithreading
difficulty: Middle
format: Code Review
time: 6
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "AtomicInteger", "volatile"]
---

# `AtomicInteger` vs `volatile`
Review the code below. A developer changed `int` to `volatile int` to make the counter thread-safe for highly concurrent increments. Is it thread-safe now? If not, what should be used instead?

```java
public class WebCounter {
    private volatile int hits = 0;

    public void recordHit() {
        hits++;
    }

    public int getHits() {
        return hits;
    }
}
```

---ANSWER---

No, the code is **still not thread-safe**.

As discussed in other questions regarding `volatile`, the `hits++` operation is not a single atomic instruction. It is a read-modify-write operation (read `hits`, add 1, write `hits`). While `volatile` ensures that the read operation sees the most recently written value, it does not prevent multiple threads from reading the same initial value simultaneously and then overwriting each other's increments.

**The Solution: `AtomicInteger`**
For lock-free thread-safe counting, you should use `AtomicInteger`. It relies on low-level CPU instructions like Compare-And-Swap (CAS) to perform the increment atomically without needing explicit locks.

**Fix:**
```java
public class WebCounter {
    private final AtomicInteger hits = new AtomicInteger(0);

    public void recordHit() {
        hits.incrementAndGet(); // This is atomic
    }

    public int getHits() {
        return hits.get();
    }
}
```

### Life Analogy
`volatile` is a real-time digital display of a bank account. Everyone sees the exact balance immediately. However, if two people look at the display showing $10, both go to deposit $5, and both independently tell the bank "change the balance to $15", the final balance is $15, not $20. 
`AtomicInteger` is an automated teller machine. When you deposit $5, the machine locks your account for a millisecond, adds $5, and unlocks it. If someone else deposits at the same time, they are forced to wait that millisecond. The balance ends up correctly at $20.

### Key Points
- `volatile` does not make compound operations (like `++`) atomic.
- `AtomicInteger` uses CAS (Compare-And-Swap) for lock-free atomic operations.
- `AtomicInteger` is the standard tool for thread-safe counters.
