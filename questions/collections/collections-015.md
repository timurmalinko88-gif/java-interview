---
id: collections-015
topic: Collections
difficulty: Senior
format: Code Review
time: 10
frequency: 40%
source: Custom
prerequisites: ["Hashing", "Object Identity"]
---

# IdentityHashMap
What is an `IdentityHashMap` and how does it differ from a standard `HashMap`?

---ANSWER---

`IdentityHashMap` is a specialized `Map` implementation designed for rare cases where reference-equality semantics are required.

1. **Equality Comparison**:
   - A standard `HashMap` uses the `equals()` method to determine if two keys are the same, and `hashCode()` to find the bucket. It relies on logical equality.
   - An `IdentityHashMap` uses the `==` operator to determine if two keys are the same, and uses `System.identityHashCode()` for hashing. It relies on strict physical reference equality.

2. **Use Case**:
   - You would use `IdentityHashMap` when you explicitly want to map distinct object instances, even if those instances would normally be considered "equal" by their `equals()` method. For example, it is used heavily in serialization/deserialization frameworks or object graph cloning to track which exact object instances have already been processed to avoid infinite loops on circular references.

3. **Internal Structure**:
   - Unlike `HashMap` which uses an array of linked nodes/trees, `IdentityHashMap` uses a flat object array where keys and values are placed adjacently (key at index `i`, value at `i+1`), and it resolves collisions using linear probing instead of separate chaining.

### Life Analogy
A `HashMap` cares if two people have the same name and ID number (logical equality). An `IdentityHashMap` only cares if they are literally the exact same physical human being standing in front of it (reference equality).

### Key Points
- Uses `==` for key comparison, not `equals()`.
- Uses `System.identityHashCode()`, not `hashCode()`.
- Resolves collisions with linear probing.
- Used for tracking exact object instances (e.g., serialization frameworks).
