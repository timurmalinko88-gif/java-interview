---
id: collections-017
topic: Collections
difficulty: Middle
format: Open Answer
time: 10
frequency: 80%
source: Custom
prerequisites: ["Concurrency"]
tags: [spring-core, stream-api, memory, multithreading, collections, exceptions]
---

# CopyOnWriteArrayList
Explain the `CopyOnWriteArrayList` and its use cases.

---ANSWER---

`CopyOnWriteArrayList` is a thread-safe variant of `ArrayList` found in the `java.util.concurrent` package.

**How it works:**
Whenever a mutative operation occurs (like `add`, `set`, or `remove`), the internal array is completely copied, the modification is made to the copy, and then the reference to the internal array is updated to point to the new array. 

Because mutative operations create a fresh copy, iterating over the list does not require locking. An iterator created from this list will operate on the "snapshot" of the array at the exact moment the iterator was created. It will not see any subsequent modifications and will never throw a `ConcurrentModificationException` (fail-safe iterator).

**Use cases:**
It is highly optimized for scenarios where read operations vastly outnumber write operations. E.g., maintaining a list of event listeners. If the list is modified frequently, the overhead of copying the entire array every time becomes a massive performance bottleneck.

### Life Analogy
Imagine a restaurant menu printed on a whiteboard. A normal `ArrayList` means the owner erases and rewrites items while customers are reading it, causing confusion. A `CopyOnWriteArrayList` means the owner buys a brand-new whiteboard in the back room, writes the new menu there, and then instantly swaps the old board for the new one. Customers reading the old board aren't interrupted.

### Key Points
- Thread-safe variant of ArrayList.
- All mutative operations create a fresh copy of the underlying array.
- Iterators use a snapshot and never throw `ConcurrentModificationException`.
- Ideal for many reads, few writes.
