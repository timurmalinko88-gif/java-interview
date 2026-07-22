---
id: collections-029
topic: Collections
difficulty: Senior
format: Open Answer
time: 5
frequency: 30%
source: Custom
prerequisites: ["Interfaces"]
tags: ['collections']
---

# NavigableSet Interface
What is a `NavigableSet` and what methods does it add over a standard `Set`?

---ANSWER---

`NavigableSet` is an interface that extends `SortedSet` to provide navigation methods reporting closest matches for given search targets. `TreeSet` is the standard implementation.

Just like `NavigableMap` does for key-value pairs, `NavigableSet` provides these navigation features for single elements.

**Key Methods:**
- `lower(E e)`: Returns the greatest element in this set strictly less than the given element.
- `floor(E e)`: Returns the greatest element less than or equal to the given element.
- `ceiling(E e)`: Returns the least element greater than or equal to the given element.
- `higher(E e)`: Returns the least element strictly greater than the given element.
- `pollFirst()` / `pollLast()`: Retrieves and removes the first (lowest) or last (highest) element.

### Life Analogy
Imagine a set of daily alarm times you have set. You look at the clock and it's 2:15 PM. You can ask the `NavigableSet` of alarms, "What was the alarm that just rang?" (`floor` or `lower`) and "When is my exact next alarm going to ring?" (`ceiling` or `higher`).

### Key Points
- Extends `SortedSet`.
- Implemented by `TreeSet`.
- Provides closest-match queries (lower, floor, ceiling, higher).
- Allows easy retrieval and removal of extremes (pollFirst, pollLast).
