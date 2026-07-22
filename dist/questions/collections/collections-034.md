---
id: collections-034
topic: Collections
difficulty: Senior
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["Concurrency"]
tags: [spring-core, system-design, stream-api, multithreading, collections]
---

# SynchronousQueue
What is a `SynchronousQueue` and what is its capacity?

---ANSWER---

A `SynchronousQueue` is a very unique implementation of `BlockingQueue` where **the capacity is exactly zero**.

It does not contain any internal capacity, not even an array of size 1. It acts strictly as a rendezvous point for threads to hand off data directly to one another.

**How it works:**
- If Thread A calls `put(e)`, it will block until Thread B comes along and calls `take()`. 
- Conversely, if Thread B calls `take()`, it will block until Thread A comes along and calls `put(e)`.
- You cannot iterate over it, you cannot `peek()` into it, and `size()` always returns 0.

It is heavily used in the `Executors.newCachedThreadPool()` implementation. When a new task is submitted, it tries to hand it off directly to an idle thread via a `SynchronousQueue`. If no thread is waiting to `take()`, the queue refuses the task, prompting the thread pool to spin up a brand new thread.

### Life Analogy
A `SynchronousQueue` is a baton pass in a relay race. There is no table to place the baton on (zero capacity). The runner with the baton (Producer) must hold it out and run alongside the next runner (Consumer) until the Consumer physically grabs it.

### Key Points
- Capacity is strictly 0.
- Direct hand-off mechanism between threads.
- `put()` blocks until `take()` is called, and vice versa.
- Used in `CachedThreadPool`.
