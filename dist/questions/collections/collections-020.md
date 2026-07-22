---
id: collections-020
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["Enums"]
tags: ['collections']
---

# EnumSet
What is an `EnumSet` and why is it preferred over `HashSet` when working with Enums?

---ANSWER---

`EnumSet` is a specialized `Set` implementation designed explicitly for use with enum types.

**Why it's preferred:**
1. **Performance**: Internally, `EnumSet` is represented as a bit vector (usually a single `long` if the enum has 64 or fewer elements). This makes operations like `add`, `contains`, and bulk operations incredibly fast—essentially reducing them to single bitwise operations. It is vastly faster than a `HashSet` which has to compute hashes and handle bucket linked lists.
2. **Memory Efficiency**: Because it uses a bit vector, it uses practically zero memory overhead compared to `HashSet`'s node objects.
3. **Ordering**: `EnumSet` iterators traverse elements in their natural order (the order the enum constants are declared).

**Limitations:**
- It only accepts elements from a single enum type.
- It does not allow `null` elements.

### Life Analogy
A `HashSet` for enums is like renting individual storage lockers for each pair of socks you own. An `EnumSet` is like a pill organizer box with days of the week labeled. It exactly fits the predefined categories (enums), takes up no extra space, and flipping open a lid (flipping a bit) is instant.

### Key Points
- Specialized Set exclusively for Enum types.
- Internally backed by a highly efficient bit vector (a `long`).
- Extremely fast and memory-efficient.
- Maintains the declaration order of the Enum constants.
