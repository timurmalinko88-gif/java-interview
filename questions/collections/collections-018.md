---
id: collections-018
topic: Collections
difficulty: Senior
format: System Design
time: 10
frequency: 70%
source: Custom
prerequisites: ["Concurrency", "Queues"]
tags: [oop, spring-core, system-design, patterns, stream-api, multithreading, collections]
---

# BlockingQueue
What is a `BlockingQueue` and how does it support the Producer-Consumer pattern?

---ANSWER---

A `BlockingQueue` is an interface in `java.util.concurrent` that extends `Queue`. It provides thread-safe operations specifically designed to handle the Producer-Consumer problem gracefully without explicit wait/notify handling by the developer.

It introduces methods that wait for the queue to become non-empty when retrieving an element, and wait for space to become available when storing an element.

**Key Blocking Methods:**
- `put(e)`: Inserts the specified element into the queue, waiting if necessary for space to become available. (Used by Producer).
- `take()`: Retrieves and removes the head of the queue, waiting if necessary until an element becomes available. (Used by Consumer).

Implementations like `ArrayBlockingQueue` (bounded) and `LinkedBlockingQueue` (optionally bounded) handle the internal locking and signaling, making it trivial to pass data safely between threads.

### Life Analogy
Think of a sushi conveyor belt between a chef (Producer) and a customer (Consumer) that only has 10 plates of space. A `BlockingQueue` means the chef will literally stand still (block) if all 10 plates are full until the customer eats one. Conversely, if the belt is empty, the customer will sit and wait (block) until the chef puts a new plate down.

### Key Points
- Thread-safe queue designed for concurrent environments.
- `put()` blocks if the queue is full.
- `take()` blocks if the queue is empty.
- Perfectly solves the Producer-Consumer pattern.
