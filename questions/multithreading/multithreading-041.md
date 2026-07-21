---
id: multithreading-041
topic: Multithreading
difficulty: Middle
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["Concurrency", "Exchanger"]
---

# `Exchanger`
What is an `Exchanger` in Java concurrency, and in what scenario would you use it?

---ANSWER---

An `Exchanger` is a synchronization point where two threads can swap objects. Each thread presents an object on entry to the `exchange()` method, matches with a partner thread, and receives its partner's object on return.

**How it works:**
If Thread A calls `exchanger.exchange(objectA)`, it blocks until Thread B calls `exchanger.exchange(objectB)`. Once both have arrived at the rendezvous point, Thread A returns with `objectB`, and Thread B returns with `objectA`.

**Scenario:**
It is useful in scenarios like genetic algorithms or pipeline designs, such as a producer-consumer setup where data is processed in batches (buffers).
For example, Thread 1 fills a buffer with data. Thread 2 consumes data from a buffer. When Thread 1 fills its buffer, and Thread 2 empties its buffer, they use an `Exchanger` to swap them. Thread 1 gets Thread 2's empty buffer to start filling again, and Thread 2 gets Thread 1's full buffer to start consuming, without needing complex locking or queueing mechanisms.

- Threads block until both arrive at the `exchange()` method.
- Great for buffer-swapping between producer and consumer.

### Life Analogy
Imagine two spies meeting on a park bench. Spy A has a briefcase of money. Spy B has a briefcase of secret documents. Spy A arrives and waits. Spy B arrives. They simultaneously slide their briefcases across the bench to each other. They both leave with the other person's briefcase. They must both be at the bench at the same time to make the swap.

### Key Points
- Facilitates a two-way data swap between exactly two threads.
