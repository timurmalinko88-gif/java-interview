---
id: collections-043
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Hashing"]
tags: ['collections']
---

# Load Factor in HashMap
What is the "Load Factor" in a `HashMap` and what is its default value?

---ANSWER---

The **Load Factor** is a measure that decides when to resize (rehash) the internal array (buckets) of a `HashMap`.

It is a threshold expressed as a ratio: `(Number of Elements) / (Number of Buckets)`. 

When the number of entries in the hash table exceeds the product of the load factor and the current capacity, the hash table is rehashed (the internal data structures are rebuilt) so that the hash table has approximately twice the number of buckets.

**Default Values:**
- The default initial capacity is **16**.
- The default load factor is **0.75**.

This means that by default, when the HashMap reaches 12 elements (16 * 0.75), it will resize its internal array to 32 buckets.

**Trade-offs:**
- A higher load factor (e.g., 0.95) decreases space overhead (uses less memory) but increases lookup cost (more collisions, longer linked lists).
- A lower load factor (e.g., 0.50) increases space overhead but reduces collisions, improving lookup speed. 0.75 is considered a perfect balance.

### Life Analogy
Imagine a restaurant with 16 tables. The manager has a rule (Load Factor of 0.75): "If 12 tables get filled, it's getting too crowded and waiters are bumping into each other (collisions). We need to instantly build an extension to make it 32 tables."

### Key Points
- Determines when the HashMap resizes its internal array.
- Default load factor is 0.75.
- Balances time complexity (collisions) and space complexity (memory footprint).
