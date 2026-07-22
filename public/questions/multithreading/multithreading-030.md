---
id: multithreading-030
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 4
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "wait", "notify"]
tags: [oop, spring-core, databases, jvm, memory, multithreading]
---

# `notify()` vs `notifyAll()`
What is the difference between `notify()` and `notifyAll()` in Java? When should you use one over the other?

---ANSWER---

Both methods are used to wake up threads that are currently waiting on an object's monitor (via the `wait()` method).

- **`notify()`**: Wakes up exactly **one** arbitrary thread that is waiting on this object's monitor. If multiple threads are waiting, you have no control over which one the JVM selects. The other threads will remain asleep.
- **`notifyAll()`**: Wakes up **all** the threads that are waiting on this object's monitor. However, because they all need the monitor lock to proceed, they will wake up and sequentially compete for the lock. Only one will get it; the others will transition from WAITING state back to BLOCKED state.

**When to use which:**
You should use `notifyAll()` in almost all scenarios. It is safer. 
Using `notify()` is only safe if:
1. All waiting threads are waiting for the exact same condition.
2. Only one thread can actually proceed upon being notified (the other threads would just check the condition and go back to sleep anyway).
If these conditions aren't perfectly met, using `notify()` can result in a "lost notification" where a thread that could have proceeded is left waiting forever, potentially causing a deadlock.

`notify()` is the butler knocking quietly on one random bedroom door and whispering, "A taxi is here." If it's the wrong person's taxi, that person goes back to sleep, and the person whose taxi actually arrived never wakes up.
`notifyAll()` is the butler turning on the hallway lights and yelling, "A taxi is here!" Everyone wakes up, checks out the window, and if it's not their taxi, they go back to sleep. It's slightly less efficient, but everyone gets their ride.

- `notifyAll()` wakes all waiting threads.
- `notifyAll()` is generally safer and prevents lost notifications.
- Wakened threads still must re-acquire the lock before continuing execution.

### Life Analogy
Imagine 10 people sleeping in a house waiting for their specific taxis.

### Key Points
- `notify()` wakes a single random waiting thread.
