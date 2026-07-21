---
id: multithreading-044
topic: Multithreading
difficulty: Middle
format: Code Review
time: 6
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "ExecutorService"]
---

# `shutdown()` vs `shutdownNow()`
Review the two methods of stopping an `ExecutorService`. What is the exact difference between `shutdown()` and `shutdownNow()`? What happens to the tasks currently in the queue?

```java
ExecutorService executor = Executors.newFixedThreadPool(2);
// ... submit 10 tasks ...
executor.shutdown(); 
// OR
List<Runnable> notExecuted = executor.shutdownNow();
```

---ANSWER---

Both methods initiate the termination of an `ExecutorService`, but they do so with different levels of aggression.

1. **`shutdown()` (Graceful Shutdown):**
   - **New Tasks**: The executor immediately stops accepting any *new* tasks (throws `RejectedExecutionException` if you try to submit).
   - **Running Tasks**: Tasks currently executing are allowed to finish normally.
   - **Queued Tasks**: Tasks sitting in the queue waiting to be executed are *retained* and will be executed by the pool before it shuts down.

2. **`shutdownNow()` (Abrupt Shutdown):**
   - **New Tasks**: Stops accepting new tasks.
   - **Running Tasks**: Attempts to stop currently executing tasks. It does this by calling `Thread.interrupt()` on the worker threads. If the running tasks do not respond to interruption, they might not stop.
   - **Queued Tasks**: Tasks sitting in the queue are **discarded** and not executed. The method returns a `List<Runnable>` containing these discarded tasks so you can potentially log or save them.

Typically, applications use a two-phased approach: call `shutdown()`, wait a few seconds using `awaitTermination()`, and if tasks are still running, force it with `shutdownNow()`.

### Life Analogy
Imagine a restaurant closing.
`shutdown()` is the manager locking the front door so no new customers can enter. However, everyone already eating, and everyone with an order already submitted to the kitchen, gets their food and finishes their meal before the staff goes home.
`shutdownNow()` is the manager locking the door, throwing all the un-cooked order tickets in the trash (returning them to you), and turning off the lights in the dining room, politely asking the current diners to leave immediately (interrupting them).

### Key Points
- `shutdown()` is graceful: finishes running AND queued tasks.
- `shutdownNow()` is abrupt: attempts to stop running tasks via interrupt, and discards queued tasks.
- Both methods reject new task submissions.
