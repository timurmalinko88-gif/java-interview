---
id: multithreading-020
topic: Multithreading
difficulty: Junior
format: Code Review
time: 3
frequency: 90%
source: Custom
prerequisites: ["Concurrency", "Thread"]
---

# Calling `run()` Instead of `start()`
Review the following code. What will be the output, and is it truly multithreaded?

```java
public class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("Running in: " + Thread.currentThread().getName());
    }
}

public class Main {
    public static void main(String[] args) {
        Thread thread = new Thread(new MyTask());
        thread.run();
    }
}
```

---ANSWER---

The code will execute, but it is **not multithreaded**. 

The output will be:
`Running in: main`

By calling `thread.run()` directly, the code is simply executing the `run` method as a normal method call in the current thread (the `main` thread). It does not instruct the JVM to allocate a new call stack or start a new thread.

To achieve multithreading, you must call `thread.start()`. The `start()` method is an intrinsic JVM method that creates a new, separate thread of execution, which then internally calls the `run()` method. If `thread.start()` were used, the output would be `Running in: Thread-0` (or similar).

### Life Analogy
Calling `start()` is like hiring an assistant and telling them to go file some documents while you continue your work. Calling `run()` is like taking the documents and filing them yourself; the assistant does nothing, and your work is paused until you finish the filing.

### Key Points
- Calling `run()` directly does not create a new thread; it executes synchronously.
- `start()` must be called to initiate a new thread of execution.
- A thread can only be started once. Calling `start()` twice throws `IllegalThreadStateException`.
