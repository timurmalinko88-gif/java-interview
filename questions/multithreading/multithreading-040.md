---
id: multithreading-040
topic: Multithreading
difficulty: Senior
format: Code Review
time: 12
frequency: 30%
source: Custom
prerequisites: ["Concurrency", "Hardware Architecture", "False Sharing"]
---

# False Sharing
Review the following high-performance computing class. Two separate threads heavily update `counterA` and `counterB` respectively. The performance is inexplicably slow on a multi-core processor. What hardware-level phenomenon is likely occurring, and how can you mitigate it?

```java
public class Counters {
    public volatile long counterA = 0L;
    public volatile long counterB = 0L;
}
```

---ANSWER---

The phenomenon occurring is **False Sharing**.

Modern CPUs do not read memory one byte at a time; they read memory in chunks called **Cache Lines** (typically 64 bytes). 
In Java, fields of an object are usually laid out contiguously in memory. Two `long` variables (`counterA` and `counterB`) take up 16 bytes and will almost certainly reside on the exact same 64-byte CPU cache line.

If Thread 1 (on CPU Core 1) updates `counterA`, it modifies its local cache line. Because `counterB` is on the same cache line, the CPU hardware cache coherency protocol marks that entire cache line as "invalid" for all other cores. 
When Thread 2 (on CPU Core 2) tries to update `counterB`, it suffers a cache miss because its cached copy was invalidated by Core 1. Core 2 must fetch the line from main memory, update `counterB`, which then invalidates Core 1's cache.

Even though the threads are operating on completely independent variables, they are inadvertently fighting over the same cache line, causing massive performance degradation (thrashing).

**Mitigation:**
You can pad the variables so they sit on different cache lines.
Since Java 8, you can use the **`@Contended`** annotation (requires a JVM flag to enable for user classes) to instruct the JVM to automatically pad the variables.

```java
public class Counters {
    @jdk.internal.vm.annotation.Contended
    public volatile long counterA = 0L;
    
    @jdk.internal.vm.annotation.Contended
    public volatile long counterB = 0L;
}
```
*(Before Java 8, developers manually added unused `long` variables between fields to force memory separation).*

### Life Analogy
Imagine two workers (threads) need to stamp documents. They have separate stamps (variables), but the stamps are tethered to the exact same heavy clipboard (cache line). When Worker 1 grabs the clipboard to use their stamp, Worker 2 can't use theirs. They constantly yank the clipboard back and forth, wasting time, even though they aren't stamping the same documents. Padding is like cutting the clipboard in half so they each have their own.

### Key Points
- False sharing occurs when independent variables share a CPU cache line.
- Updates to one variable invalidate the cache for the other, causing thrashing.
- Mitigated by memory padding (e.g., `@Contended` annotation).
