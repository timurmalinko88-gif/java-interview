---
id: multithreading-016
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Concurrency", "Thread"]
tags: [oop, spring-core, databases, jvm, multithreading, exceptions]
---

# Thread Lifecycle States
What are the different states a thread can be in during its lifecycle in Java, according to the `Thread.State` enum?

---ANSWER---

A thread in Java can be in one of the following six states during its lifecycle, as defined by the `Thread.State` enum:

1. **NEW**: A thread has been created (e.g., `new Thread()`) but the `start()` method has not yet been called.
2. **RUNNABLE**: A thread is executing in the JVM. It might be running or waiting for operating system resources like the processor.
3. **BLOCKED**: A thread is blocked waiting for a monitor lock to enter or re-enter a synchronized block/method.
4. **WAITING**: A thread is waiting indefinitely for another thread to perform a particular action (e.g., calling `Object.wait()` without a timeout, or `Thread.join()`).
5. **TIMED_WAITING**: A thread is waiting for another thread to perform an action for up to a specified waiting time (e.g., `Thread.sleep()`, `Object.wait(timeout)`).
6. **TERMINATED**: A thread has completed execution (its `run()` method has exited normally or thrown an unhandled exception).

- **NEW**: You've printed your resume, but haven't left the house.
- **RUNNABLE**: You are walking or driving to the office (you might hit traffic, but you're making progress).
- **BLOCKED**: You arrived, but the door is locked and you have to wait for someone with a key.
- **WAITING**: You are told to sit in the lobby until someone calls your name.
- **TIMED_WAITING**: You are put on hold on the phone for 5 minutes.
- **TERMINATED**: The interview is over and you've gone home.

- BLOCKED is specifically for waiting on a monitor lock.
- WAITING/TIMED_WAITING are used for inter-thread coordination.

### Life Analogy
Think of a person going to a job interview:

### Key Points
- `Thread.State` has 6 enum values: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.
