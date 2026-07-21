---
id: multithreading-032
topic: Multithreading
difficulty: Junior
format: System Design
time: 5
frequency: 90%
source: Custom
prerequisites: ["Concurrency", "ExecutorService", "Thread"]
---

# `ExecutorService` vs Direct `Thread` Creation
You are building an application that needs to process 10,000 image files asynchronously. Why is it a bad idea to do `new Thread(task).start()` for each image? Why is an `ExecutorService` a better design?

---ANSWER---

Creating a new `Thread` for every task (10,000 times) is a bad design for several reasons:

1. **Overhead**: Creating and destroying a thread is an expensive operation at the OS level. It requires allocating a call stack and context switching. Doing this 10,000 times wastes significant CPU time just managing threads.
2. **Resource Exhaustion**: Threads consume memory (typically ~1MB per thread stack). Creating 10,000 concurrent threads could easily lead to an `OutOfMemoryError`.
3. **Thrashing**: Even if memory holds up, the OS CPU scheduler will thrash, spending more time switching between the 10,000 threads than actually processing the images.

**Why `ExecutorService` is better:**
An `ExecutorService` implements the **Thread Pool** pattern. 
Instead of creating a thread for every task, it creates a fixed number of worker threads (e.g., 10). The 10,000 tasks are placed in a queue. The 10 worker threads continually pull tasks from the queue and execute them.
- Thread creation overhead is paid only once (at startup).
- Memory usage is strictly bounded and predictable.
- CPU thrashing is eliminated because the active thread count is kept close to the number of physical cores.

### Life Analogy
Creating a new thread per task is like building a brand new kitchen, hiring a new chef, cooking one meal, and then bulldozing the kitchen and firing the chef. Doing that for 10,000 meals is absurd.
An `ExecutorService` is a restaurant. You build one kitchen with 10 chefs (threads), and they take 10,000 orders (tasks) from a ticket rail, cooking them one by one.

### Key Points
- Thread creation is expensive and consumes memory.
- Unbounded thread creation leads to OutOfMemory and CPU thrashing.
- `ExecutorService` reuses a bounded pool of threads to execute a queue of tasks.
