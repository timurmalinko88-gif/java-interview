---
id: collections-028
topic: Collections
difficulty: Senior
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["Interfaces"]
---

# NavigableMap Interface
What is a `NavigableMap` in Java? Give an example of an implementation.

---ANSWER---

`NavigableMap` is an interface in the Java Collections Framework that extends `SortedMap`. It provides navigation methods to find the closest matches for specific search targets, making it extremely powerful for range queries.

`TreeMap` is the most common implementation of `NavigableMap`.

**Key Navigation Methods:**
- `lowerKey(K key)`: Returns the greatest key strictly less than the given key.
- `floorKey(K key)`: Returns the greatest key less than or equal to the given key.
- `ceilingKey(K key)`: Returns the least key greater than or equal to the given key.
- `higherKey(K key)`: Returns the least key strictly greater than the given key.

It also provides methods to get map views in reverse order (`descendingMap()`) and bounded ranges (`subMap`, `headMap`, `tailMap`).

### Life Analogy
Imagine a map of shoe sizes in a store. A regular `Map` only lets you ask "Do you have size 10 exactly?". A `NavigableMap` lets you ask "I need a size 10, but if you don't have it, what is the next largest size you have in stock?" (`ceilingKey`).

### Key Points
- Extends `SortedMap`.
- Provides methods like `lowerKey`, `floorKey`, `ceilingKey`, and `higherKey`.
- Useful for closest-match and range queries.
- Implemented by `TreeMap`.
