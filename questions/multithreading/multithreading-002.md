---
id: multithreading-002
topic: Multithreading
difficulty: Junior
format: Open Answer
estimated_time_minutes: 7
frequency: High
related_questions: [How ThreadPoolExecutor works, Thread lifecycle]
source: Custom
prerequisites: [Thread class, Runnable interface]
---

On a project, a developer implemented asynchronous email notifications: for every user registration, they create a new thread:

```java
new Thread(() -> emailService.send(user)).start();
```

What is the fatal flaw of this approach for a web application with increasing load? How should this solution be properly designed using the standard Java library?

---ANSWER---

The fatal flaw lies in the **uncontrolled consumption of system resources**.

Creating a new `Thread` object in the OS is a very "expensive" operation (memory allocation for the thread stack, usually around 1 MB, and system calls). If 10,000 users arrive at the site simultaneously, the application will create 10,000 threads. This will lead to:

* Exhausting RAM and crashing with `OutOfMemoryError: unable to create new native thread`.
* Huge amounts of CPU time wasted on Context Switching between thousands of threads instead of doing useful work.

**Correct solution:** Use a Thread Pool via `ExecutorService`. For example:

```java
ExecutorService executor = Executors.newFixedThreadPool(10);
executor.submit(() -> emailService.send(user));
```

A thread pool pre-creates a limited number of threads that are reused. Tasks are placed into an internal queue (`BlockingQueue`) and are executed by available threads as they become free. This smooths out peak loads and protects the application from crashing.

### Life Analogy

Creating a `new Thread()` for every task is like hiring a new courier for every package, buying them a bicycle, and after they deliver a single package, firing them and throwing away the bicycle. A thread pool (`ExecutorService`) is a staff of 10 full-time couriers: if there are more packages than couriers, the packages simply wait their turn in the warehouse.

### Key Points
* Creating a thread is a heavy and resource-intensive operation at the OS level (prior to the introduction of Virtual Threads in Java 21).
* Uncontrolled thread creation leads to `OutOfMemoryError` and performance degradation due to Context Switching.
* `ExecutorService` allows you to reuse threads and control their maximum number.
* Tasks that exceed the pool size are safely buffered in a queue.
