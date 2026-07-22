---
id: multithreading-017
topic: Multithreading
difficulty: Middle
format: System Design
time: 10
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "ThreadPoolExecutor"]
tags: ['multithreading']
---

# ThreadPoolExecutor Tuning
You need to create a custom thread pool for a web server handling short-lived, CPU-bound tasks. Explain how the core parameters of `ThreadPoolExecutor` (`corePoolSize`, `maximumPoolSize`, `workQueue`) interact, and how you would configure them for this scenario.

---ANSWER---

The `ThreadPoolExecutor` uses these parameters to manage task execution:
- **`corePoolSize`**: The number of threads to keep in the pool, even if they are idle.
- **`workQueue`**: The queue used to hold tasks before they are executed.
- **`maximumPoolSize`**: The maximum number of threads allowed in the pool.

**How they interact:**
1. When a task is submitted, if the current number of threads is less than `corePoolSize`, a new thread is created to run the task.
2. If `corePoolSize` is reached, the task is added to the `workQueue`.
3. If the `workQueue` becomes full, and the thread count is less than `maximumPoolSize`, a new thread is created.
4. If `maximumPoolSize` is reached and the queue is full, tasks are rejected based on the `RejectedExecutionHandler`.

**Configuration for short-lived, CPU-bound tasks:**
For CPU-bound tasks, having more threads than available CPU cores actually hurts performance due to context switching overhead. 
- **`corePoolSize` and `maximumPoolSize`**: Both should typically be set to the number of available CPU cores (e.g., `Runtime.getRuntime().availableProcessors() + 1`).
- **`workQueue`**: A bounded queue (like `ArrayBlockingQueue`) is preferred to prevent OutOfMemory errors if requests spike. The queue size should be tuned based on acceptable wait times.

- New threads are spawned only *after* the queue is full (up to max pool size).
- CPU-bound thread pools should be sized close to the number of CPU cores.

### Life Analogy
Imagine a restaurant kitchen. `corePoolSize` is your full-time chefs. `workQueue` is the ticket rail where orders are placed. `maximumPoolSize` includes temp chefs you call in. If a new order comes and full-time chefs are busy, you put it on the rail. If the rail is full, you call in temp chefs. If they are all busy and the rail is full, you turn customers away (Reject). For CPU tasks, adding more chefs than stoves just causes them to bump into each other.

### Key Points
- Tasks queue up only *after* core pool size is reached.
