---
id: collections-001
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Data Structures"]
tags: ['collections']
---

# Difference between ArrayList and LinkedList
What are the main differences between `ArrayList` and `LinkedList` in Java? When would you choose one over the other?

---ANSWER---

Both `ArrayList` and `LinkedList` implement the `List` interface, but they have different internal implementations and performance characteristics.

- **ArrayList** is backed by a dynamic array. It offers fast O(1) random access but slow O(n) insertions/deletions in the middle of the list because elements need to be shifted.
- **LinkedList** is backed by a doubly-linked list. It offers slow O(n) random access (requires traversal) but fast O(1) insertions/deletions if you already have a reference to the node, though adding to the end is O(1) for both. LinkedList also implements `Deque`, so it can be used as a queue or stack.

Choose `ArrayList` when you need fast random access and do mostly appending. Choose `LinkedList` when you do many insertions and deletions in the middle of the list and don't need fast random access.

### Life Analogy
Think of `ArrayList` like a row of lockers next to each other. You can jump directly to locker #10 instantly, but if you want to insert a new locker in the middle, you have to push all the other lockers down.
Think of `LinkedList` like a scavenger hunt where each clue points to the next. You can't jump directly to clue #10 without following all previous clues, but adding a new clue in the middle just means changing where two existing clues point.

### Key Points
- `ArrayList` uses a dynamic array.
- `LinkedList` uses a doubly-linked list.
- `ArrayList` gives O(1) random access, `LinkedList` gives O(n).
- `ArrayList` is generally preferred as the default list implementation due to better cache locality.
