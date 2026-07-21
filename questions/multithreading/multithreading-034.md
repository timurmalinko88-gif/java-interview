---
id: multithreading-034
topic: Multithreading
difficulty: Middle
format: Code Review
time: 8
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "Thread Interruption"]
---

# Stopping a Thread
Review the following code intended to stop a background worker thread. What is wrong with using `Thread.stop()`, and what is the correct mechanism to stop a thread?

```java
public class WorkerControl {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            while (true) {
                // Do some heavy processing
                System.out.println("Working...");
            }
        });
        
        worker.start();
        Thread.sleep(1000);
        worker.stop(); // Stops the thread
    }
}
```

---ANSWER---

The `Thread.stop()` method is **deprecated and highly dangerous**.

**Why it's wrong:**
Calling `stop()` causes the thread to instantly throw a `ThreadDeath` error, killing the thread dead in its tracks, no matter what it was doing. If the thread was in the middle of a complex operation (like updating a database or transferring money) and held monitor locks, it forcefully releases all locks immediately. This leaves shared data structures in an inconsistent, corrupted state, causing unpredictable errors elsewhere in the application.

**The Correct Mechanism: Interruption**
Java uses a cooperative mechanism for stopping threads. You should request the thread to stop using `interrupt()`, and the thread itself should check its interrupted status and shut down gracefully.

**Fix:**
```java
public class WorkerControl {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            // Check interrupted flag
            while (!Thread.currentThread().isInterrupted()) {
                System.out.println("Working...");
                // If the loop contains blocking calls (like sleep/wait), 
                // they will throw InterruptedException and clear the flag.
            }
            System.out.println("Cleaning up and stopping gracefully.");
        });
        
        worker.start();
        Thread.sleep(1000);
        worker.interrupt(); // Requests the thread to stop
    }
}
```

### Life Analogy
`Thread.stop()` is like stopping a moving car by detonating a bomb under the engine. The car stops immediately, but everything inside is destroyed.
`Thread.interrupt()` is like turning on a flashing dashboard light that says "Please pull over". The driver (the thread) sees the light, finishes their current maneuver safely, steers to the shoulder, and turns off the engine properly.

### Key Points
- `Thread.stop()` is inherently unsafe and deprecated.
- It abruptly releases locks, potentially corrupting shared state.
- Use `Thread.interrupt()` to politely request a thread to stop.
- The running thread is responsible for checking its interrupted status and exiting gracefully.
