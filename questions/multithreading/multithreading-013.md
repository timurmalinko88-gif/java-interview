---
id: multithreading-013
topic: Multithreading
difficulty: Senior
format: System Design
time: 15
frequency: 60%
source: Custom
prerequisites: ["Concurrency", "Locks", "ReadWriteLock"]
---

# In-Memory Cache with High Read/Write Ratio
Design a thread-safe, in-memory cache data structure. The cache is expected to handle a very high volume of read operations (95% of traffic) and occasional write operations (5% of traffic). What concurrency primitives would you use to maximize throughput?

---ANSWER---

For a cache with a high read-to-write ratio, standard `synchronized` blocks or a single `ReentrantLock` would be a bottleneck, as they allow only one thread (read or write) to access the cache at a time. 

The optimal concurrency primitive for this scenario is a **`ReadWriteLock`** (specifically `ReentrantReadWriteLock` or `StampedLock`).

A `ReadWriteLock` maintains a pair of associated locks: one for read-only operations and one for writing. 
- The **read lock** can be held simultaneously by multiple reader threads, as long as there are no writers. This perfectly suits the 95% read traffic, allowing massive parallelization.
- The **write lock** is exclusive. When a thread needs to write, it must wait for all current readers to finish, and once it holds the write lock, it blocks all other readers and writers.

**Implementation with `ReentrantReadWriteLock`:**
```java
public class Cache<K, V> {
    private final Map<K, V> map = new HashMap<>();
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final Lock readLock = lock.readLock();
    private final Lock writeLock = lock.writeLock();

    public V get(K key) {
        readLock.lock();
        try {
            return map.get(key);
        } finally {
            readLock.unlock();
        }
    }

    public void put(K key, V value) {
        writeLock.lock();
        try {
            map.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }
}
```
*Note: `ConcurrentHashMap` could also be used and often outperforms `ReadWriteLock` for simple map operations due to lock striping and non-blocking reads, but discussing `ReadWriteLock` directly answers the question about concurrency primitives for custom structures.*

- `ReadWriteLock` enforces exclusive access for writers.
- Ideal for high-read, low-write scenarios.
- `ConcurrentHashMap` is a highly optimized alternative for simple key-value caching.

### Life Analogy
Imagine an art gallery. The read lock is like letting multiple people browse the paintings at the same time—they don't interfere with each other. The write lock is like the curator needing to hang a new painting. To do so, they must clear the room (exclusive access) so no one bumps into them, hang the painting, and then let everyone back in to view it.

### Key Points
- `ReadWriteLock` allows multiple concurrent readers.
