---
id: live-012
path: questions/live-coding/live-012.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Thread-safe Connection Pool on BlockingQueue
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

# Thread-safe Connection Pool on BlockingQueue
We are trying to build a custom lightweight Database Connection Pool. The current implementation uses a standard `LinkedList` to store available connections. Threads use `synchronized` blocks with `wait()` and `notify()` to borrow and return connections. It's complex, hard to read, and occasionally threads get stuck waiting forever.

Can you refactor this Connection Pool to be clean and inherently thread-safe using Java's `java.util.concurrent` utilities, specifically a `BlockingQueue`?

---ANSWER---

Managing thread communication manually with `wait()` and `notify()` is error-prone. It requires careful handling of synchronization blocks, handling spurious wakeups, and ensuring that notifications aren't missed. 

Java's `BlockingQueue` interface (e.g., `ArrayBlockingQueue` or `LinkedBlockingQueue`) is designed exactly for this Producer-Consumer pattern. It encapsulates all the complex thread-safety, locking, and signaling logic inside the collection itself.
- `take()` blocks automatically if the queue is empty until an item becomes available.
- `put()` blocks automatically if the queue is full until space becomes available.

By using an `ArrayBlockingQueue`, we can completely eliminate explicit `synchronized`, `wait()`, and `notify()` code. The resulting pool is highly concurrent, robust, and extremely easy to read.

### Examples
```java
// BUGGY CODE (Error-prone manual synchronization):
public class ConnectionPool {
    private final List<Connection> pool = new LinkedList<>();
    private final int limit = 10;

    public synchronized Connection borrowConnection() throws InterruptedException {
        while (pool.isEmpty()) {
            wait(); // Prone to missed signals or spurious wakeups
        }
        return pool.remove(0);
    }

    public synchronized void returnConnection(Connection conn) {
        if (pool.size() < limit) {
            pool.add(conn);
            notifyAll(); 
        }
    }
}

// REFACTORED CODE (Clean and robust via BlockingQueue):
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class ConnectionPool {
    private final BlockingQueue<Connection> pool;

    public ConnectionPool(int capacity) {
        // Initializes a bounded thread-safe queue
        this.pool = new ArrayBlockingQueue<>(capacity);
        for (int i = 0; i < capacity; i++) {
            pool.offer(createNewConnection());
        }
    }

    public Connection borrowConnection() throws InterruptedException {
        // Automatically blocks if empty, no wait() needed!
        return pool.take(); 
    }

    public void returnConnection(Connection conn) {
        // Automatically adds to queue. 
        // We use offer() to ignore if somehow returned beyond capacity.
        pool.offer(conn); 
    }
    
    private Connection createNewConnection() {
        return new MockConnection();
    }
}
```

### Life Analogy
Manual `wait/notify` is like directing traffic at a busy intersection with no traffic lights, just shouting at cars when it's safe to go. It's stressful and accidents happen. 
A `BlockingQueue` is like installing an automated traffic light system. The cars (threads) just follow the red and green lights built into the road. You don't have to manage the signals manually anymore.

### Key Points
- Prefer `java.util.concurrent` classes over manual `wait/notify` and `synchronized` blocks.
- `BlockingQueue` naturally solves Producer-Consumer and resource pooling problems.
- `take()` and `put()` are blocking methods; `poll()` and `offer()` are non-blocking alternatives.
