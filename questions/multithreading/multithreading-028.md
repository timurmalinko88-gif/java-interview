---
id: multithreading-028
topic: Multithreading
difficulty: Senior
format: System Design
time: 15
frequency: 70%
source: Custom
prerequisites: ["Concurrency", "Condition", "ReentrantLock"]
---

# Designing a Concurrent Bounded Queue
Design a thread-safe, bounded blocking queue from scratch (without using `java.util.concurrent` collections). It should support `put` (blocks if full) and `take` (blocks if empty). Explain your choice of synchronization primitives.

---ANSWER---

A common and highly efficient way to design a bounded blocking queue is using a single `ReentrantLock` paired with two `Condition` variables: `notFull` and `notEmpty`.

Using a standard `synchronized` block with `wait()` and `notifyAll()` is less efficient because `notifyAll()` wakes up *all* waiting threads (both producers and consumers), leading to unnecessary context switching. By using two `Condition` variables, producers can specifically wake up consumers, and consumers can specifically wake up producers.

**Implementation:**
```java
public class BoundedQueue<T> {
    private final Object[] items;
    private int putPtr, takePtr, count;
    
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull  = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public BoundedQueue(int capacity) {
        items = new Object[capacity];
    }

    public void put(T x) throws InterruptedException {
        lock.lock();
        try {
            while (count == items.length) {
                notFull.await(); // Wait until not full
            }
            items[putPtr] = x;
            if (++putPtr == items.length) putPtr = 0;
            count++;
            notEmpty.signal(); // Tell consumers they can take
        } finally {
            lock.unlock();
        }
    }

    public T take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0) {
                notEmpty.await(); // Wait until not empty
            }
            @SuppressWarnings("unchecked")
            T x = (T) items[takePtr];
            if (++takePtr == items.length) takePtr = 0;
            count--;
            notFull.signal(); // Tell producers they can put
            return x;
        } finally {
            lock.unlock();
        }
    }
}
```
*Note: A `while` loop is crucial for `await()` to handle spurious wakeups.*

- Producers wait on `notFull` and signal `notEmpty`.
- Consumers wait on `notEmpty` and signal `notFull`.
- Always wait inside a `while` loop to prevent spurious wakeups.

### Life Analogy
Imagine a bakery display case (the queue). The baker (producer) has a bell (`notEmpty`) to ring when fresh bread is put out. The customer (consumer) has a bell (`notFull`) to ring when they buy bread, clearing space. If the case is full, the baker naps until the customer rings `notFull`. If the case is empty, the customer naps until the baker rings `notEmpty`. This is much better than a single bell waking up everyone for every event.

### Key Points
- `ReentrantLock` with multiple `Condition` variables allows targeted signaling.
