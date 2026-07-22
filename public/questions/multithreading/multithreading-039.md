---
id: multithreading-039
topic: Multithreading
difficulty: Middle
format: System Design
time: 8
frequency: 70%
source: Custom
prerequisites: ["Concurrency", "ScheduledExecutorService"]
tags: ['multithreading']
---

# `ScheduledExecutorService`
You need to design a background task that polls an external API every 5 minutes. Describe how you would implement this using `ScheduledExecutorService`. What is the difference between `scheduleAtFixedRate` and `scheduleWithFixedDelay`?

---ANSWER---

You would use `Executors.newScheduledThreadPool(int corePoolSize)` to obtain a `ScheduledExecutorService`. Then, you submit a `Runnable` task to it using either `scheduleAtFixedRate` or `scheduleWithFixedDelay`.

**Implementation:**
```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
Runnable apiPoller = () -> { /* Call external API */ };

// Using fixed rate:
scheduler.scheduleAtFixedRate(apiPoller, 0, 5, TimeUnit.MINUTES);
```

**The Difference:**
- **`scheduleAtFixedRate(task, initialDelay, period, unit)`**: Executes the task at a strict periodic interval. If the period is 5 minutes, it runs at T=0, T=5, T=10, T=15. However, if a task takes *longer* than the period (e.g., the API call takes 6 minutes), the executor will not spawn a concurrent execution (tasks don't overlap). It will queue the next execution and run it immediately after the current one finishes.
- **`scheduleWithFixedDelay(task, initialDelay, delay, unit)`**: The delay is calculated from the *completion* of the previous task to the *start* of the next. If the task takes 2 minutes, and the delay is 5 minutes, executions will happen at T=0, T=7, T=14. 

For an API poller, `scheduleWithFixedDelay` is often safer to prevent the system from being overwhelmed if the external API becomes slow, ensuring there is always a guaranteed 5-minute breather between calls.

**Fixed Delay**: Taking a pill, and then setting a timer for 4 hours *after* you swallow it. If it takes you an hour to swallow the pill, your next dose is at 5 hours, not 4.

- Fixed Rate focuses on absolute time intervals.
- Fixed Delay focuses on resting periods between task executions.
- Tasks scheduled by the same executor do not overlap concurrently.

### Life Analogy
**Fixed Rate**: Taking a pill exactly at 8:00 AM, 12:00 PM, and 4:00 PM (every 4 hours), regardless of how long it takes you to swallow it.

### Key Points
- `ScheduledExecutorService` replaces the legacy `java.util.Timer`.
