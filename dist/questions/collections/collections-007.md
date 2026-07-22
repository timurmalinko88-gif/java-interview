---
id: collections-007
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Data Structures"]
tags: [oop, spring-core, stream-api, collections, exceptions]
---

# TreeSet vs HashSet
What are the differences between `TreeSet` and `HashSet`? When would you use one over the other?

---ANSWER---

`TreeSet` and `HashSet` both implement the `Set` interface, but they behave differently regarding ordering and performance.

1. **Ordering**:
   - `HashSet` does not guarantee any order of its elements. It's based on hash codes.
   - `TreeSet` guarantees that elements will be sorted in ascending order (either by their natural ordering or by a provided `Comparator`).

2. **Internal Implementation**:
   - `HashSet` is backed by a `HashMap` (which uses an array of buckets and linked lists/trees).
   - `TreeSet` is backed by a `TreeMap` (which uses a balanced Red-Black tree structure).

3. **Performance**:
   - `HashSet` offers constant time O(1) performance for basic operations (add, remove, contains).
   - `TreeSet` offers log time O(log n) performance for these operations due to the tree traversal.

4. **Null Elements**:
   - `HashSet` allows one `null` element.
   - `TreeSet` does not allow `null` elements (it will throw a `NullPointerException` because it needs to compare elements to sort them).

Use `HashSet` for better performance when you don't care about order. Use `TreeSet` when you need a sorted collection.

### Life Analogy
A `HashSet` is like throwing receipts into a shoebox. You can find one fast, but they are completely jumbled. A `TreeSet` is like keeping your receipts in a binder sorted by date. It takes slightly longer to file a new receipt, but they are always perfectly ordered.

### Key Points
- `HashSet` is unordered (O(1)); `TreeSet` is sorted (O(log n)).
- `HashSet` is backed by a HashMap; `TreeSet` is backed by a TreeMap (Red-Black tree).
- `TreeSet` does not allow nulls.
