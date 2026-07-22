---
id: collections-008
topic: Collections
difficulty: Middle
format: Open Answer
time: 10
frequency: 70%
source: Custom
prerequisites: ["Data Structures", "Trees"]
tags: [oop, spring-core, stream-api, memory, multithreading, collections]
---

# PriorityQueue in Java
Explain `PriorityQueue` in Java. What data structure is it based on?

---ANSWER---

A `PriorityQueue` in Java is an implementation of the `Queue` interface that processes elements based on their priority, rather than in a strict First-In-First-Out (FIFO) order.

It is based on a **priority heap** data structure, specifically a **min-heap** by default. This means the head of the queue is always the least element according to the specified ordering. You can change this to a max-heap by providing a custom `Comparator` at initialization.

When elements are added (`offer`), they are placed into the heap and "bubbled up" to maintain the heap property. When the head is removed (`poll`), the last element is moved to the root and "bubbled down". Insertion and removal take O(log n) time, while peeking at the head takes O(1) time.

Important notes: 
- It does not permit `null` elements.
- It is not thread-safe. For thread-safe operations, use `PriorityBlockingQueue`.

### Life Analogy
Imagine an emergency room triage. Instead of a normal line (FIFO queue) where patients are seen in the exact order they arrive, a Priority Queue ensures that a patient with a severe injury (highest priority) goes straight to the front of the line, ahead of someone who arrived earlier with a minor cough.

### Key Points
- Processes elements based on priority, not FIFO.
- Backed by an array-based min-heap.
- Head of the queue is the smallest element (or highest priority based on Comparator).
- O(log n) for add/poll, O(1) for peek.
