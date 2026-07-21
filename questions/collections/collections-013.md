---
id: collections-013
topic: Collections
difficulty: Middle
format: System Design
time: 10
frequency: 60%
source: Custom
prerequisites: ["Hashing", "Linked Lists"]
tags: [spring-core, system-design, stream-api, collections]
---

# LinkedHashMap Insertion Order
How does `LinkedHashMap` maintain the insertion order of elements?

---ANSWER---

`LinkedHashMap` extends `HashMap`, meaning it inherits the hash table array and bucket architecture. However, it additionally maintains a doubly-linked list running through all of its entries.

When a new key-value pair is inserted:
1. It is placed into the appropriate bucket based on its hash code (just like `HashMap`).
2. The newly created node (which extends the standard HashMap node) is also appended to the tail of the internal doubly-linked list.

When you iterate over a `LinkedHashMap`, it ignores the hash buckets entirely and instead walks through this doubly-linked list from head to tail. This guarantees that elements are returned in the exact order they were inserted.

`LinkedHashMap` can also be configured (via its constructor) to maintain **access order** instead of insertion order, which is highly useful for building LRU (Least Recently Used) caches. In access order mode, whenever an entry is accessed (via `get` or `put`), it is moved to the tail of the linked list.

### Life Analogy
Imagine a parking lot (`HashMap`). Cars are parked in numbered spots based on their license plates. A `LinkedHashMap` is the same parking lot, but there's a long rope tying the front bumper of the first car that arrived to the back bumper of the second car, and so on. To find cars in order of arrival, you just follow the rope.

### Key Points
- Extends `HashMap`.
- Maintains a doubly-linked list of all entries.
- Iteration traverses the linked list, not the buckets.
- Can be configured for access-order (useful for LRU cache).
