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

# Custom Rate Limiter (Token Bucket)
We need to implement a simple thread-safe Rate Limiter to protect our API from being overwhelmed. The current implementation uses a naive counter that resets every minute via a background thread, but it causes severe latency spikes exactly at the start of every minute (thundering herd problem) and is prone to race conditions.

Can you implement a smooth, thread-safe rate limiter using the Token Bucket algorithm without relying on a background timer thread?

---ANSWER---

The naive counter approach fails under high concurrency and allows traffic bursts at the reset boundaries. The Token Bucket algorithm is much smoother. It works by conceptualizing a bucket that holds a maximum number of tokens. Tokens are added to the bucket at a constant rate. When a request comes in, it must take a token from the bucket. If the bucket is empty, the request is rejected.

To avoid a background thread constantly adding tokens, we calculate the number of tokens to add lazily, at the exact moment a request attempts to take a token. We look at the time elapsed since the last refill and calculate how many tokens should have been added in that duration.

We must use synchronization (or `Atomic` classes/`ReentrantLock`) to ensure the time check, token calculation, and token deduction happen atomically.

### Examples
```java
// REFACTORED CODE (Token Bucket Implementation):
public class TokenBucketRateLimiter {
    private final long capacity;
    private final double refillTokensPerSecond;
    
    private double availableTokens;
    private long lastRefillTimestamp;

    public TokenBucketRateLimiter(long capacity, double refillTokensPerSecond) {
        this.capacity = capacity;
        this.refillTokensPerSecond = refillTokensPerSecond;
        this.availableTokens = capacity;
        this.lastRefillTimestamp = System.nanoTime();
    }

    public synchronized boolean tryAcquire() {
        refill();
        if (availableTokens >= 1.0) {
            availableTokens -= 1.0;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = System.nanoTime();
        double elapsedSeconds = (now - lastRefillTimestamp) / 1_000_000_000.0;
        double tokensToAdd = elapsedSeconds * refillTokensPerSecond;
        
        if (tokensToAdd > 0) {
            availableTokens = Math.min(capacity, availableTokens + tokensToAdd);
            lastRefillTimestamp = now;
        }
    }
}
```

### Life Analogy
Imagine a leaky water bucket at a theme park ride, but in reverse. A hose slowly and continuously drips water (tokens) into the bucket at a steady rate. Whenever a guest wants to ride, they must scoop a cup of water out of the bucket. If the bucket is dry, they have to wait. Because the water fills continuously, the guests flow steadily onto the ride instead of everyone rushing in exactly at the top of the hour.

### Key Points
- Token Bucket provides smooth rate limiting without harsh cutoffs at time boundaries.
- Lazy calculation of time elapsed eliminates the need for expensive, inaccurate background timer threads.
- Proper synchronization is required to prevent race conditions during concurrent `tryAcquire()` calls.
