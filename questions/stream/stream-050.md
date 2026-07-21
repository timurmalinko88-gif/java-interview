---
id: stream-050
topic: Stream API
difficulty: Senior
format: System Design
time: 10
frequency: 70%
source: Custom
prerequisites: ["Parallel Streams", "Multithreading"]
---

# ForkJoinPool and Parallel Streams
How do parallel streams execute tasks under the hood in Java? Is it possible to configure the thread pool used by parallel streams?

---ANSWER---

Under the hood, `parallelStream()` utilizes the **Fork/Join Framework** introduced in Java 7 to split tasks recursively into smaller subtasks, process them concurrently, and join the results back together.

Specifically, all parallel streams in a Java application share the **common `ForkJoinPool`** (`ForkJoinPool.commonPool()`). By default, the size of this pool is equal to the number of logical CPU cores minus one (`Runtime.getRuntime().availableProcessors() - 1`). The main calling thread is also utilized, bringing the total worker count to the number of available cores.

**Configuring the Thread Pool:**

1. **Global Configuration (System Property):**
   You can change the size of the common pool globally for the entire JVM by setting a system property before the pool is initialized:
   ```java
   System.setProperty("java.util.concurrent.ForkJoinPool.common.parallelism", "16");
   ```
   *Danger:* This affects all parallel streams and CompletableFutures across the entire application.

2. **Custom ForkJoinPool (The Workaround):**
   The Stream API does not provide a direct method to pass a custom thread pool (like `stream.parallel(myPool)`). However, there is a known trick. If you submit the parallel stream execution as a task *inside* a custom `ForkJoinPool`, the stream will intelligently use that specific pool's threads instead of the common pool.
   ```java
   ForkJoinPool customThreadPool = new ForkJoinPool(4);
   
   long result = customThreadPool.submit(
       () -> myList.parallelStream().map(this::heavyTask).count()
   ).get(); // get() waits for completion
   
   customThreadPool.shutdown();
   ```

### Life Analogy
The `commonPool` is like a city's public transit bus system. By default, every commuter (parallel stream) uses this single shared system. If one group of commuters takes up all the buses with heavy luggage (blocking tasks), everyone else in the city is stuck waiting at the bus stops. 
Using a custom `ForkJoinPool` is like renting a private charter bus specifically for your group, ensuring you don't disrupt the city's public system.

### Key Points
- Parallel streams use the common `ForkJoinPool` by default.
- Default parallelism is (CPU cores - 1).
- Long-running or blocking tasks in a parallel stream will starve the common pool, affecting the whole JVM.
- You can isolate a stream by executing it inside a `customThreadPool.submit()`.
