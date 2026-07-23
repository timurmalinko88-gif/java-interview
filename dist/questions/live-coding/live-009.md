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

# CompletableFuture timeout & fallback chain
We have a service that makes an asynchronous HTTP call using `CompletableFuture`. However, if the external service hangs, our `get()` call blocks indefinitely, eventually exhausting our server's thread pool. Furthermore, if an exception occurs, we don't have a clean way to return a default fallback value.

Can you refactor this using modern `CompletableFuture` API features to enforce a timeout (e.g., 2 seconds) and gracefully provide a fallback value upon failure?

---ANSWER---

Blocking indefinitely on a `CompletableFuture.get()` defeats the purpose of non-blocking asynchronous programming and makes the system vulnerable to cascading failures if downstream services degrade.

In Java 9, `CompletableFuture` was enhanced with timeout handling methods: `orTimeout()` and `completeOnTimeout()`. 
- `orTimeout(long timeout, TimeUnit unit)` completes the future exceptionally with a `TimeoutException` if it doesn't finish in time.
- `completeOnTimeout(T value, long timeout, TimeUnit unit)` successfully completes the future with a default value if the timeout is reached.

To handle exceptions gracefully (whether they are timeout exceptions or actual execution errors), we can chain the `exceptionally()` method. This acts like a catch block for the asynchronous pipeline, allowing us to log the error and return a safe fallback value.

### Examples
```java
// BUGGY CODE:
public String fetchUserData(String userId) {
    try {
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            return externalClient.callSlowApi(userId);
        });
        // Blocks forever if API hangs!
        return future.get(); 
    } catch (Exception e) {
        return "ERROR";
    }
}

// REFACTORED CODE:
public String fetchUserData(String userId) {
    CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
        return externalClient.callSlowApi(userId);
    });

    // Java 9+ timeout and fallback chaining
    return future
            .orTimeout(2, TimeUnit.SECONDS) // Throw TimeoutException if taking too long
            .exceptionally(ex -> {
                // Log the exception (ex could be TimeoutException or API error)
                System.err.println("API call failed or timed out: " + ex.getMessage());
                return "FALLBACK_USER_DATA"; // Return safe default
            })
            .join(); // Safe to block here, we guarantee it finishes within 2s
}
```

### Life Analogy
Imagine ordering a pizza for a party. 
Buggy code: You order the pizza, sit by the door, and wait indefinitely. If the driver gets lost, you starve forever.
Refactored code: You order the pizza, but you set a 45-minute timer (`orTimeout`). If the timer goes off or the pizzeria calls to say they crashed (`exceptionally`), you immediately heat up frozen burritos from the fridge (fallback value) so the party doesn't end.

### Key Points
- Never call `.get()` or `.join()` on a `CompletableFuture` without ensuring it has a bounded execution time.
- Use `orTimeout()` (Java 9+) to enforce time limits on async tasks.
- Use `exceptionally()` to transform failures into default, safe responses within the async pipeline.
