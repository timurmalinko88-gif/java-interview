---
id: multithreading-010
topic: Multithreading
difficulty: Senior
format: System Design
time: 10
frequency: 60%
source: Custom
prerequisites: ["ExecutorService", "BlockingQueue", "Thread Lifecycle"]
tags: ['multithreading']
---

# Designing a Thread Pool

How would you implement a simple Thread Pool from scratch in Java? Explain the core components required and how they interact.

---ANSWER---

Implementing a custom thread pool involves managing worker threads and a task queue. While Java provides the powerful `ExecutorService`, building one from scratch tests deep multithreading understanding.

**Core Components needed:**
1. **Task Queue (`BlockingQueue<Runnable>`):** A thread-safe queue (like `LinkedBlockingQueue`) that holds the tasks submitted by clients until a worker thread is available to execute them.
2. **Worker Threads (`List<WorkerThread>`):** A pool of pre-instantiated threads that run continuously in a loop.
3. **ThreadPool Manager:** The main class that initializes the workers, holds the queue, and provides an `execute(Runnable task)` method.

**How they interact (The Implementation):**

1. **Initialization:** When the `CustomThreadPool` is instantiated with a size `N`, it creates and starts `N` worker threads.
2. **Task Submission:** Clients call `execute(Runnable)`. This method simply adds the task to the `BlockingQueue`.
3. **Worker Loop:** Inside each `WorkerThread`'s `run()` method, there is a `while(true)` loop. The thread calls `queue.take()`. 
   - If the queue is empty, `take()` blocks the thread, putting it to sleep.
   - When a task is added, a waiting thread wakes up, receives the `Runnable`, and calls `task.run()`.
   - After `run()` finishes, the loop restarts, and the worker fetches the next task.

**Shutdown Mechanism:**
To cleanly shut down, you need a way to stop the `while(true)` loops. A common approach is a `boolean isStopped` flag. The shutdown method sets the flag and calls `interrupt()` on all worker threads to break them out of `queue.take()`.

- The core pattern is the Producer-Consumer pattern using a `BlockingQueue`.
- Worker threads run an infinite loop, blocking on the queue's `take()` method until a task is available.
- Proper lifecycle management (shutdown, interruption) is the hardest part of a custom implementation.

### Life Analogy
A Thread Pool is like a restaurant kitchen. The **Worker Threads** are the chefs. The **Task Queue** is the order ticket rail. The waiters (client threads) place orders on the rail. The chefs do not get hired and fired for each order; they stand by the rail, take the next ticket, cook it, and then immediately return to the rail for the next ticket.

### Key Points
- A thread pool reuses threads to avoid the heavy cost of thread creation/destruction.
