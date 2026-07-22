---
id: collections-014
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Data Structures"]
tags: [oop, spring-core, databases, stream-api, memory, collections]
---

# Queue vs Deque
What is the difference between a `Queue` and a `Deque`?

---ANSWER---

Both `Queue` and `Deque` are interfaces in the Java Collections Framework used for holding elements prior to processing.

1. **Definition**:
   - `Queue` stands for a standard queue data structure, which typically operates in a First-In-First-Out (FIFO) manner.
   - `Deque` stands for "Double Ended Queue". It is a linear collection that supports element insertion and removal at both ends.

2. **Operations**:
   - `Queue` only allows adding elements to the tail (offer) and removing from the head (poll).
   - `Deque` allows adding and removing from both the head (addFirst, removeFirst) and the tail (addLast, removeLast).

3. **Versatility**:
   - Because a `Deque` allows operations at both ends, it can be used as both a FIFO queue and a LIFO stack. In fact, Java recommends using `Deque` implementations (like `ArrayDeque`) over the legacy `Stack` class.

### Life Analogy
A `Queue` is a standard checkout line at a grocery store. You join at the back, and the cashier serves the person at the front. A `Deque` is a pipe where you can push tennis balls in from either the left side or the right side, and pull them out from either side as well.

### Key Points
- `Queue` is FIFO (usually).
- `Deque` is double-ended, allowing insertion/removal at both ends.
- `Deque` can be used as a Queue or a Stack.
