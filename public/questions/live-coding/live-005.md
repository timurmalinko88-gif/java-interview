---
id: live-005
path: questions/live-coding/live-005.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Custom Rate Limiter (Token Bucket)
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

Implement a thread-safe `RateLimiter` using the Token Bucket algorithm. It should allow a maximum of `maxTokens` requests per second.

**Skeleton Code:**

```java
public class RateLimiter {
    public RateLimiter(int maxTokens, long refillIntervalMillis) {
        // init
    }

    public boolean tryAcquire() {
        // implement
        return false;
    }
}
```

### Challenge
Provide a working, thread-safe implementation without using external libraries like Guava.

---

### Solution

**Explanation:**
The token bucket algorithm maintains a count of available tokens. Every request consumes a token. Tokens are replenished at a fixed rate, up to the maximum capacity. We need synchronization to prevent race conditions during concurrent access.

**Implementation:**

```java
import java.util.concurrent.TimeUnit;

public class RateLimiter {
    private final long maxTokens;
    private final long refillIntervalMillis;
    private long availableTokens;
    private long lastRefillTimestamp;

    public RateLimiter(long maxTokens, long refillIntervalMillis) {
        this.maxTokens = maxTokens;
        this.refillIntervalMillis = refillIntervalMillis;
        this.availableTokens = maxTokens;
        this.lastRefillTimestamp = System.currentTimeMillis();
    }

    public synchronized boolean tryAcquire() {
        refill();

        if (availableTokens > 0) {
            availableTokens--;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = System.currentTimeMillis();
        long timeElapsed = now - lastRefillTimestamp;

        if (timeElapsed >= refillIntervalMillis) {
            long tokensToAdd = (timeElapsed / refillIntervalMillis);
            availableTokens = Math.min(maxTokens, availableTokens + tokensToAdd);
            lastRefillTimestamp = now;
        }
    }
}
```
