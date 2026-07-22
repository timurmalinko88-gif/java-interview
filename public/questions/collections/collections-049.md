---
id: collections-049
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 30%
source: Custom
prerequisites: ["Concurrency"]
tags: ['collections']
---

# Collections.emptyList() Thread Safety
Is `Collections.emptyList()` thread-safe? Why or why not?

---ANSWER---

Yes, the list returned by `Collections.emptyList()` is **completely thread-safe**.

**Why?**
Because the list it returns is **immutable**. Thread safety issues (like race conditions or data corruption) only arise when multiple threads attempt to modify shared state. Since the empty list cannot be modified by any thread (calling `add()` or `remove()` throws an `UnsupportedOperationException`), there is no shared mutable state.

Furthermore, `Collections.emptyList()` is highly optimized. It doesn't create a new object every time you call it. It simply returns a reference to a single, static, final, stateless instance of an internal class (`EmptyList`). This means calling it thousands of times across hundreds of threads uses virtually no memory and causes no garbage collection overhead.

### Life Analogy
Thread-safety issues happen when two people try to write on the same whiteboard at the same time. `Collections.emptyList()` is like handing everyone in the room an identical, blank sheet of steel. It is impossible to write on it. Therefore, no matter how many people are holding it, no one can mess it up for anyone else. It's perfectly safe.

### Key Points
- It is absolutely thread-safe.
- It is immutable (cannot be modified).
- It returns a single static instance, making it highly memory efficient.
