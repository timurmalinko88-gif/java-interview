---
id: collections-031
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 50%
source: Custom
prerequisites: ["Data Structures"]
---

# LinkedList Queue Implementation
How does `LinkedList` implement the `Queue` and `Deque` interfaces?

---ANSWER---

`LinkedList` in Java is a versatile data structure that implements `List`, `Deque`, and indirectly `Queue` (since `Deque` extends `Queue`).

Because it is a doubly-linked list, it maintains pointers to both the `head` (first node) and `tail` (last node).

**Implementing Queue (FIFO):**
- When acting as a Queue, you use `offer(e)` to add elements. `LinkedList` implements this by appending the new node to the `tail` (O(1) time).
- You use `poll()` to retrieve and remove elements. `LinkedList` implements this by detaching and returning the node at the `head` (O(1) time).

**Implementing Deque:**
- Because it has access to both ends and links in both directions, it trivially supports `addFirst()`, `addLast()`, `pollFirst()`, and `pollLast()`, all in O(1) time complexity.

### Life Analogy
Using a `LinkedList` as a `Queue` is like a train with open doors on the very first and very last car. People (data) get on at the caboose (tail/offer) and get off at the engine (head/poll). Because the conductor knows exactly where the engine and caboose are, it takes zero time to find the start and end of the train.

### Key Points
- Implements `List`, `Deque`, and `Queue`.
- Queue `offer()` maps to adding to the tail.
- Queue `poll()` maps to removing from the head.
- All Queue/Deque operations are O(1) due to head/tail pointers.
