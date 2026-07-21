---
id: collections-012
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["Iterators"]
---

# Iterator vs ListIterator
What is the difference between `Iterator` and `ListIterator`?

---ANSWER---

`Iterator` and `ListIterator` are both interfaces used to traverse collections, but `ListIterator` provides more functionality specifically for lists.

1. **Direction**: 
   - `Iterator` can only traverse the collection in a forward direction using `hasNext()` and `next()`.
   - `ListIterator` can traverse the list in both forward and backward directions using `hasNext()`/`next()` and `hasPrevious()`/`previous()`.

2. **Applicability**:
   - `Iterator` can be used to traverse any `Collection` (List, Set, Queue).
   - `ListIterator` can ONLY be used to traverse `List` implementations.

3. **Modification**:
   - `Iterator` only allows removing elements (via `remove()`).
   - `ListIterator` allows adding, replacing, and removing elements during iteration (via `add()`, `set()`, and `remove()`).

4. **Index**:
   - `Iterator` does not provide a way to obtain the index of elements.
   - `ListIterator` provides methods like `nextIndex()` and `previousIndex()` to track positions.

### Life Analogy
An `Iterator` is like watching a movie at a cinema; you can only go forward and you can't see the exact timestamp. A `ListIterator` is like watching a movie on YouTube; you can go forward, go backward, jump to specific times, and even splice in new clips if you are editing it.

### Key Points
- `Iterator` is forward-only; `ListIterator` is bidirectional.
- `Iterator` is for all Collections; `ListIterator` is for Lists only.
- `ListIterator` allows modifications like add and set, while `Iterator` only allows remove.
