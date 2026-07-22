---
id: multithreading-048
topic: Multithreading
difficulty: Junior
format: Code Review
time: 5
frequency: 65%
source: Custom
prerequisites: ["Concurrency", "Exceptions", "Thread"]
tags: ['multithreading']
---

# Uncaught Exceptions in Threads
Review the code below. If an exception is thrown inside the background thread, will the `try-catch` block in the `main` method catch it? If not, how do you handle it?

```java
public class ThreadException {
    public static void main(String[] args) {
        try {
            Thread t = new Thread(() -> {
                throw new RuntimeException("Background thread failed");
            });
            t.start();
        } catch (Exception e) {
            System.out.println("Caught exception: " + e.getMessage());
        }
    }
}
```

---ANSWER---

No, the `try-catch` block in the `main` method **will not catch the exception**. 

When `t.start()` is called, the JVM creates an entirely separate call stack for the new thread. The `RuntimeException` is thrown on that new call stack. The `main` thread's `try-catch` block only monitors the `main` thread's call stack. Therefore, the background thread will terminate abruptly, the exception will be printed to the standard error stream by the JVM, and the main thread will continue running blissfully unaware.

**How to handle it:**
You should set an `UncaughtExceptionHandler` on the thread before starting it.

```java
Thread t = new Thread(() -> {
    throw new RuntimeException("Background thread failed");
});

t.setUncaughtExceptionHandler((thread, exception) -> {
    System.out.println("Caught in handler: " + exception.getMessage());
});

t.start();
```

- A `try-catch` in one thread cannot catch an exception thrown in another.
- Use `Thread.setUncaughtExceptionHandler()` to handle exceptions that escape a thread's `run` method.

### Life Analogy
The main thread and the background thread are like two coworkers in different rooms. The main thread says "Start working!" and then puts on noise-canceling headphones (its own try-catch). The background coworker trips and yells (throws exception). The main thread can't hear them because they are in different rooms. An `UncaughtExceptionHandler` is like giving the background worker an emergency pager that alerts the boss directly if something goes wrong.

### Key Points
- Exceptions do not propagate across thread boundaries.
