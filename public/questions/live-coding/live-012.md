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

### Problem

Write a thread-safe custom connection pool wrapper that hands out database connections up to a specific limit. If all connections are busy, calling threads should block until a connection becomes available.

**Skeleton Code:**

```java
public class ConnectionPool {
    
    public ConnectionPool(int poolSize) {
        // init pool
    }

    public Connection getConnection() throws InterruptedException {
        // block until connection is available
        return null; 
    }

    public void releaseConnection(Connection conn) {
        // return to pool
    }
}
```

### Challenge
Implement it cleanly using a `BlockingQueue`.

---

### Solution

**Explanation:**
Java's `BlockingQueue` (like `ArrayBlockingQueue`) inherently supports thread-safe operations that block. We can initialize the queue with pre-created connections. `take()` will automatically block if the pool is empty, and `put()` or `offer()` will add the connection back.

**Implementation:**

```java
import java.sql.Connection;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class ConnectionPool {
    
    private final BlockingQueue<Connection> pool;

    public ConnectionPool(int poolSize) {
        pool = new ArrayBlockingQueue<>(poolSize);
        for (int i = 0; i < poolSize; i++) {
            pool.offer(createNewConnection());
        }
    }

    public Connection getConnection() throws InterruptedException {
        // take() blocks until an element becomes available
        return pool.take();
    }

    public void releaseConnection(Connection conn) {
        if (conn != null) {
            // offer() puts element back, doesn't throw if queue is somehow full
            pool.offer(conn); 
        }
    }
    
    private Connection createNewConnection() {
        // Dummy implementation for DB connection creation
        return null; 
    }
}
```
