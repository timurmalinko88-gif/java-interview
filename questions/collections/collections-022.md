---
id: collections-022
topic: Collections
difficulty: Senior
format: System Design
time: 15
frequency: 60%
source: Custom
prerequisites: ["Trees"]
---

# TreeMap Internal Implementation
Explain the internal implementation of `TreeMap`.

---ANSWER---

`TreeMap` is a NavigableMap implementation based on a **Red-Black Tree**.

A Red-Black tree is a self-balancing binary search tree. Every node in the tree stores a key-value pair, along with references to its left and right children, its parent, and a "color" (red or black) used for balancing.

**Properties:**
1. **Ordering**: The keys are ordered based on their natural ordering (`Comparable`) or by a `Comparator` provided at map creation time. This allows for ranged operations like `subMap`, `headMap`, and `tailMap`.
2. **Performance**: Basic operations like `get`, `put`, `remove`, and `containsKey` operate in O(log n) time.
3. **Balancing**: When elements are inserted or deleted, the tree might violate Red-Black properties (e.g., no two red nodes can be adjacent). The tree performs a series of color flips and rotations (left or right) to rebalance itself, ensuring the tree's height remains O(log n).
4. **Nulls**: `TreeMap` does not allow `null` keys (as it must compare them), but allows `null` values.

### Life Analogy
A `TreeMap` is like a perfectly organized family tree or corporate org chart. Every time a new person is hired, the HR department (the balancing algorithm) instantly shifts managers and reports around to ensure no one manager has too many reports, keeping the hierarchy shallow so you can find anyone quickly (O(log n)).

### Key Points
- Backed by a Red-Black Tree.
- Keeps keys sorted.
- O(log n) time complexity for basic operations.
- Does not allow null keys.
