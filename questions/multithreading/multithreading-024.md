---
id: multithreading-024
topic: Multithreading
difficulty: Middle
format: Code Review
time: 5
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "wait", "notify"]
---

# `IllegalMonitorStateException`
Review the following code. What exception will be thrown when it executes, and why?

```java
public class WaitExample {
    public static void main(String[] args) {
        Object lock = new Object();
        try {
            lock.wait();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

---ANSWER---

This code will throw an **`IllegalMonitorStateException`** at runtime.

The exception is thrown because the current thread is attempting to call `wait()` on the `lock` object *without owning the lock's monitor*. 

In Java, to call `wait()`, `notify()`, or `notifyAll()` on an object, the calling thread must first acquire the lock (monitor) for that object. This is typically done by placing the method call inside a `synchronized` block or a `synchronized` method that synchronizes on that specific object.

**Fix:**
```java
public class WaitExample {
    public static void main(String[] args) {
        Object lock = new Object();
        synchronized (lock) { // Acquire the monitor first
            try {
                lock.wait(); 
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

- The thread must own the monitor of the object it is invoking the methods on.
- Failing to do so results in `IllegalMonitorStateException`.

### Life Analogy
Imagine a public speaker's podium with a microphone. The microphone is the monitor. You cannot just walk into the room and shout "I yield the floor!" (`wait()`). You must first be recognized and given the microphone (`synchronized(lock)`). Only when you possess the microphone can you officially pause your speech and invite someone else to speak.

### Key Points
- `wait()`, `notify()`, and `notifyAll()` must be called from a synchronized context.
