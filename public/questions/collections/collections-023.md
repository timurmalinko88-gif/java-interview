---
id: collections-023
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Data Structures"]
tags: ['collections']
---

# Stack vs Deque
Why is the `Stack` class considered legacy, and what should be used instead?

---ANSWER---

The `Stack` class in Java represents a Last-In-First-Out (LIFO) stack of objects. However, it is considered a legacy class for several reasons:

1. **Inheritance Issue**: `Stack` extends `Vector`. This was a poor design choice because a stack should only allow push, pop, and peek. By extending `Vector`, `Stack` inherits methods like `insertElementAt(index)`, allowing users to insert elements into the middle of the stack, breaking the LIFO contract.
2. **Performance**: Because it extends `Vector`, all its methods are synchronized, adding unnecessary locking overhead in single-threaded environments.

**What to use instead:**
Java officially recommends using the `Deque` interface and its implementations (like `ArrayDeque`) for stack operations. 
A `Deque` provides `push()`, `pop()`, and `peek()` methods, behaves perfectly as a LIFO stack, doesn't carry the synchronization overhead, and strictly enforces stack behavior if you program against the interface.

Example:
`Deque<Integer> stack = new ArrayDeque<>();`

### Life Analogy
Using the legacy `Stack` class is like buying a high-security combination safe to store your dirty laundry. It's unnecessarily locked, slow to open, and surprisingly has a backdoor that lets anyone throw socks into the middle of the pile. Using `ArrayDeque` is like using a proper, open laundry basket—fast, efficient, and things only go in and out of the top.

### Key Points
- `Stack` extends `Vector`, violating the LIFO principle by exposing positional access.
- `Stack` is synchronized and slow.
- `Deque` (specifically `ArrayDeque`) is the recommended replacement for LIFO operations.
