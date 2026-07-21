---
id: multithreading-006
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 3
frequency: 85%
source: Custom
prerequisites: ["Threads", "Runnable"]
---

# Thread vs Runnable

What are the two main ways to create a thread in Java, and why is one generally preferred over the other?

---ANSWER---

In Java, there are two main ways to create a new thread:
1. **Extending the `Thread` class**: You create a class that extends `java.lang.Thread` and override its `run()` method.
2. **Implementing the `Runnable` interface**: You create a class that implements `java.lang.Runnable`, implement the `run()` method, and then pass an instance of this class to a `Thread` object.

**Why implementing `Runnable` is preferred:**
- **Multiple Inheritance:** Java does not support multiple inheritance of classes. If you extend `Thread`, your class cannot extend any other class. If you implement `Runnable`, your class is still free to extend another class.
- **Separation of Concerns:** The `Runnable` interface represents the task to be executed, while the `Thread` class represents the worker that executes the task. It is a better design to separate the task from the runner.
- **Reusability and Resource Management:** A `Runnable` instance can be passed to an `ExecutorService` (thread pools), which is the modern and scalable way to handle multithreading in Java. Thread objects are heavy, and creating them for every task is inefficient.

### Life Analogy
Imagine you are hiring a chef (the `Thread`) to cook a recipe (the `Runnable`). Extending `Thread` is like cloning a specific chef who only knows how to cook one specific recipe. Implementing `Runnable` is like writing down a recipe and handing it to any available chef to cook.

### Key Points
- There are two ways to create threads: extend `Thread` or implement `Runnable`.
- `Runnable` is preferred because Java lacks multiple class inheritance.
- `Runnable` cleanly separates the task logic from the thread execution mechanism.
- `Runnable` instances work seamlessly with modern Java `ExecutorService` thread pools.
