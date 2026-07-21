---
id: multithreading-031
topic: Multithreading
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Concurrency", "Semaphore"]
---

# `Semaphore`
What is a `Semaphore` in Java, and how does it differ from a standard lock like `ReentrantLock`? Provide a common use case.

---ANSWER---

A `Semaphore` is a concurrency utility that maintains a set of permits. Threads acquire permits to enter a critical section and release them when they are done. 

**Differences from a Lock:**
- A Lock (like `synchronized` or `ReentrantLock`) provides **mutual exclusion**—only exactly ONE thread can hold the lock and access the resource at a time.
- A Semaphore controls **concurrent access**—it allows up to N threads to access a resource simultaneously, where N is the number of permits initialized in the Semaphore. If a Semaphore is initialized with 1 permit (a binary semaphore), it behaves similarly to a Lock.

**Common Use Case:**
Semaphores are used to bound resource pools. 
For example, if you have an application that connects to a legacy database that can only handle a maximum of 10 concurrent connections, you would initialize a `Semaphore(10)`. Before a thread can execute a database query, it must call `semaphore.acquire()`. If 10 threads are already querying the DB, the 11th thread will block until one of the first 10 calls `semaphore.release()`.

A Semaphore is a parking lot with 10 parking spaces and an attendant. Up to 10 cars can enter. The attendant (Semaphore) keeps track. When the lot is full, the 11th car must wait at the gate until a car leaves and frees up a space (permit).

- `acquire()` takes a permit; `release()` returns a permit.
- Used to throttle traffic and manage pools of limited resources.
- A Semaphore with 1 permit is called a binary semaphore.

### Life Analogy
A Lock is a bathroom with one toilet. Only one person can enter.

### Key Points
- Semaphores maintain a configurable number of permits.
