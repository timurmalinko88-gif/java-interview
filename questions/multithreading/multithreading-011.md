---
id: multithreading-011
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "Object Methods"]
---

# `Thread.sleep()` vs `Object.wait()`
What is the fundamental difference between `Thread.sleep()` and `Object.wait()` in Java?

---ANSWER---

The fundamental differences between `Thread.sleep()` and `Object.wait()` lie in their purpose, the class they belong to, and how they handle locks.

1. **Class location**: `sleep()` is a static method of the `Thread` class. `wait()` is an instance method of the `Object` class.
2. **Lock handling**: When a thread calls `Thread.sleep()`, it pauses execution for a specified duration but **retains any monitors/locks** it has acquired. When a thread calls `Object.wait()`, it pauses execution and **releases the lock** on the object it was called on, allowing other threads to acquire that lock.
3. **Usage context**: `wait()` must be called from within a synchronized block or method. `sleep()` can be called from anywhere.
4. **Waking up**: A sleeping thread wakes up after the specified time expires or if it is interrupted. A waiting thread wakes up when another thread calls `notify()` or `notifyAll()` on the same object (or after a timeout if a timed `wait()` was used).

- `Object.wait()` releases the lock.
- `wait()` must be called in a synchronized context.
- `wait()` is typically used for inter-thread communication.

### Life Analogy
Imagine a shared bathroom (the object/lock). `Thread.sleep()` is like going into the bathroom, locking the door, and taking a nap inside. No one else can use it until you wake up and leave. `Object.wait()` is like realizing you forgot your towel, stepping out of the bathroom, and leaving the door open for someone else while you wait for a friend to bring you a towel (which is the `notify()`).

### Key Points
- `Thread.sleep()` does not release the lock.
