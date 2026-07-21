---
id: collections-035
topic: Collections
difficulty: Senior
format: System Design
time: 10
frequency: 25%
source: Custom
prerequisites: ["Concurrency"]
tags: [oop, spring-core, system-design, stream-api, multithreading, collections]
---

# DelayQueue
What is a `DelayQueue` and what are its primary use cases?

---ANSWER---

`DelayQueue` is an unbounded `BlockingQueue` of `Delayed` elements. 

**How it works:**
Elements placed in a `DelayQueue` must implement the `java.util.concurrent.Delayed` interface, which requires providing an expiration delay (`getDelay()`) and a way to compare elements (`compareTo()`).

An element can only be taken (`take()` or `poll()`) from the queue **when its delay has expired**. 
Internally, it is backed by a `PriorityQueue`. The queue orders elements based on their expiration time, so the element closest to expiring is always at the head of the queue. If the head element hasn't expired yet, the `take()` method will block the consumer thread until the exact moment the delay expires.

**Use Cases:**
- **Cache eviction scheduling**: Removing old items from a cache after a certain TTL (Time To Live).
- **Task scheduling**: Executing background tasks or retries after a specific delay.
- **Connection timeouts**: Closing idle connections after a period of inactivity.

### Life Analogy
A `DelayQueue` is like a timed safe lock. You can put your money inside and set a timer for 24 hours. Even if you stand in front of the safe and pull on the handle (`take()`), it absolutely will not open until the exact moment the 24-hour timer expires.

### Key Points
- Queue holds elements implementing the `Delayed` interface.
- Elements cannot be consumed until their delay expires.
- Backed by a `PriorityQueue` ordered by expiration time.
- Useful for scheduling timeouts and delays.
