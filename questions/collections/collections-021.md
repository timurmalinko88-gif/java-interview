---
id: collections-021
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 45%
source: Custom
prerequisites: ["Enums"]
---

# EnumMap
What is an `EnumMap` and what are its advantages?

---ANSWER---

`EnumMap` is a specialized `Map` implementation designed to be used exclusively with enum keys.

**How it works:**
Internally, it is implemented as a simple array. When you put a value into the map, it uses the `ordinal()` value of the enum key as the index in the internal array to store the value.

**Advantages:**
1. **Performance**: Because it maps directly to array indices via `ordinal()`, it avoids the overhead of calling `hashCode()`, dealing with buckets, or managing tree nodes. All operations (put, get, remove) are extremely fast, constant-time O(1) array accesses.
2. **Memory Efficiency**: It does not need to wrap entries in `Node` or `Entry` objects like `HashMap` does. It's just a raw array, making it highly compact.

**Limitations:**
- Keys must be of a single enum type.
- Keys cannot be `null`.

### Life Analogy
If a `HashMap` is a large warehouse where workers have to compute the shelf location based on a complex product ID, an `EnumMap` is an egg carton. There are exactly 12 spots. If the enum is "Spot 3", you just instantly drop the egg into the 3rd hole without thinking.

### Key Points
- Specialized Map for Enum keys.
- Internally backed by a simple array.
- Uses enum `ordinal()` for array indexing.
- Extremely fast and memory efficient.
