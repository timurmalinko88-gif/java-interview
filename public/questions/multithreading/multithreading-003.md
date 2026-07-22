---
id: multithreading-003
topic: Multithreading
difficulty: Middle
format: Open Answer
estimated_time_minutes: 10
frequency: Medium
related_questions: [Difference between CPU-bound and IO-bound, Custom thread pool configuration]
source: Custom
prerequisites: [CompletableFuture, ForkJoinPool, Stream API]
tags: [spring-core, databases, stream-api, multithreading, collections, exceptions]
---

You need to make 20 independent HTTP requests to a third-party weather API, collect their results into a list, and return it to the user.

You have two options for parallel execution:

* Use `urls.parallelStream().map(...).collect(...)`
* Create a list of tasks via `CompletableFuture.supplyAsync(...)` and combine them.

Which option would you choose for production code and why? What will happen "under the hood" in both cases?

---ANSWER---

The correct choice for HTTP requests (I/O-bound tasks) is **`CompletableFuture` with a custom thread pool**.

**Why not `parallelStream()`?**

By default, `parallelStream` uses the shared `ForkJoinPool.commonPool()`. The size of this pool is equal to the number of logical processor cores minus 1 (for example, on a 4-core server there will be 3 threads). An HTTP request is an I/O operation. The thread sending the request simply blocks while waiting for the network response.

If you send 20 requests via `parallelStream`, you will instantly clog up the entire `commonPool` with blocked threads. This will affect the rest of the application — any other parallel streams in other parts of the system will simply wait in line until the network responds.

**Why `CompletableFuture`?**

In the `CompletableFuture.supplyAsync(supplier, executor)` method, you can pass a custom `ExecutorService` (for example, configured for 50-100 threads specifically for I/O operations). This allows HTTP requests to run in an isolated pool without blocking the system-wide `commonPool`. In addition, `CompletableFuture` provides a rich API for combining asynchronous results (e.g., `allOf()`) and handling timeouts/errors.

* Blocking threads in `commonPool` causes degradation of the entire application (Thread Starvation).
* For network requests and database operations (I/O-bound), it is necessary to use asynchronous operations with separate, specially configured thread pools.
* `CompletableFuture` allows you to explicitly specify an `Executor` and easily combine the results of independent calls.

### Life Analogy

`commonPool` is the general checkout lines in a supermarket. If you send people there who will spend 10 minutes looking for change in their wallets (HTTP request), the entire line in the store will come to a standstill. A custom pool in `CompletableFuture` is like allocating a separate window "only for long operations" so as not to interfere with the main flow of customers (CPU operations).

### Key Points
* `parallelStream` uses `ForkJoinPool.commonPool()`, which is optimized for computational (CPU-bound) tasks, not for waiting (I/O).
