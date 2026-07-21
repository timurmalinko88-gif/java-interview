---
id: collections-036
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Data Structures"]
---

# HashSet vs HashMap
What is the difference between `HashSet` and `HashMap`?

---ANSWER---

While both `HashSet` and `HashMap` are part of the Java Collections Framework and deal with hashing, they serve fundamentally different purposes:

1. **Purpose**:
   - `HashMap` is an implementation of the `Map` interface. It stores data as **Key-Value pairs**.
   - `HashSet` is an implementation of the `Set` interface. It stores **unique elements** (objects).

2. **Addition Method**:
   - `HashMap` uses the `put(key, value)` method to add elements.
   - `HashSet` uses the `add(element)` method to add elements.

3. **Internal Relationship**:
   - Internally, a `HashSet` actually uses a `HashMap` to store its data. When you call `add(element)` on a `HashSet`, it calls `put(element, PRESENT)` on its internal `HashMap`, where `PRESENT` is just a constant dummy object used as the value.

4. **Nulls**:
   - `HashMap` allows one `null` key and multiple `null` values.
   - `HashSet` allows exactly one `null` element.

### Life Analogy
A `HashMap` is a dictionary where you look up a word (key) to find its definition (value). A `HashSet` is just a simple checklist of unique words you have learned; you don't care about definitions, you just want to know if you've seen the word before.

### Key Points
- `HashMap` stores key-value pairs (Map).
- `HashSet` stores unique elements (Set).
- `HashSet` is internally backed by a `HashMap`.
