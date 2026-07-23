---
id: live-009
path: questions/live-coding/live-009.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: CompletableFuture timeout & fallback chain
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

You are implementing a resilient microservice call using `CompletableFuture`. You need to fetch user details. If it takes longer than 1 second, it should timeout. If an exception or timeout occurs, it should fallback to returning a default "Guest" user object.

**Skeleton Code:**

```java
import java.util.concurrent.CompletableFuture;

public class AsyncService {
    
    public CompletableFuture<String> fetchUserDataAsync() {
        return CompletableFuture.supplyAsync(() -> {
            // Simulates long running DB/API call
            try { Thread.sleep(2000); } catch (InterruptedException e) {}
            return "User: Alice";
        });
    }
    
    public CompletableFuture<String> getUserWithFallback() {
        // TODO: Implement timeout (1s) and fallback to "Guest"
        return fetchUserDataAsync(); 
    }
}
```

### Challenge
Complete `getUserWithFallback` using modern Java (9+) `CompletableFuture` API features.

---

### Solution

**Explanation:**
Java 9 added `orTimeout(long timeout, TimeUnit unit)` and `completeOnTimeout(T value, long timeout, TimeUnit unit)` to `CompletableFuture`. 
If we want to handle any error (including timeouts or underlying task exceptions), we can use `orTimeout()` combined with `exceptionally()`. Alternatively, `completeOnTimeout` provides a default value specifically for timeouts. 
Using `exceptionally` handles both normal exceptions thrown by `fetchUserDataAsync` and `TimeoutException`.

**Refactored Code:**

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class AsyncService {
    
    public CompletableFuture<String> fetchUserDataAsync() {
        return CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(2000); } catch (InterruptedException e) {}
            return "User: Alice";
        });
    }
    
    public CompletableFuture<String> getUserWithFallback() {
        return fetchUserDataAsync()
                // Java 9+: Fail with TimeoutException if taking > 1 second
                .orTimeout(1, TimeUnit.SECONDS)
                // Fallback to Guest if any exception occurs (including TimeoutException)
                .exceptionally(ex -> {
                    System.out.println("Error fetching user: " + ex.getMessage());
                    return "Guest";
                });
    }
}
```
