---
id: multithreading-008
topic: Multithreading
difficulty: Middle
format: Code Review
time: 5
frequency: 70%
source: Custom
prerequisites: ["wait/notify", "Monitors"]
tags: [oop, spring-core, multithreading, collections, exceptions]
---

# Code Review: Wait and Notify

Review the following code snippet. Can you identify the bugs and explain how to fix them?

```java
public class MessageQueue {
    private String message;

    public void produce(String msg) {
        message = msg;
        notify();
    }

    public String consume() throws InterruptedException {
        if (message == null) {
            wait();
        }
        String temp = message;
        message = null;
        return temp;
    }
}
```

---ANSWER---

There are two major critical bugs in this code related to thread synchronization:

1. **`IllegalMonitorStateException` (Missing `synchronized` block):**
   - **Issue:** The methods `wait()` and `notify()` must be called from within a synchronized context (e.g., a `synchronized` method or block) locking on the exact object whose `wait()`/`notify()` is being invoked.
   - **Fix:** Add the `synchronized` keyword to both `produce()` and `consume()` methods.

2. **Spurious Wakeups (Using `if` instead of `while`):**
   - **Issue:** The `consume()` method uses an `if` statement to check if the message is null. Threads can wake up from `wait()` without `notify()` being called (known as spurious wakeups), or another thread might have consumed the message between the wakeup and the lock acquisition. 
   - **Fix:** `wait()` must **always** be wrapped in a `while` loop that re-checks the condition.

**Corrected Code:**
```java
public class MessageQueue {
    private String message;

    public synchronized void produce(String msg) {
        message = msg;
        notify(); // or notifyAll()
    }

    public synchronized String consume() throws InterruptedException {
        while (message == null) {
            wait();
        }
        String temp = message;
        message = null;
        return temp;
    }
}
```

- Always check the wait condition inside a `while` loop to protect against spurious wakeups and state changes.

### Life Analogy
Using `wait()` in an `if` block instead of a `while` loop is like waking up to your alarm, assuming it is morning, and immediately going to work without checking the clock. If the alarm malfunctioned (spurious wakeup) and it is 3 AM, you are going to have a bad time. Always check the clock (the `while` condition) after waking up!

### Key Points
- `wait()`, `notify()`, and `notifyAll()` must always be called inside a `synchronized` block on the object's monitor.
