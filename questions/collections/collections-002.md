---
id: collections-002
topic: Collections
difficulty: Middle
format: Open Answer
time: 10
frequency: 95%
source: Custom
prerequisites: ["Hashing", "Data Structures"]
---

# How HashMap works internally
Explain the internal working of `HashMap` in Java. What happens during `put()` and `get()` operations?

---ANSWER---

`HashMap` in Java is a hash table implementation that stores key-value pairs.

Internally, it uses an array of "buckets" (often implemented as Nodes/Map.Entry). 
When you call `put(key, value)`:
1. It calculates the hash code of the key using `key.hashCode()`.
2. It applies a hashing function to this hash code to determine the index in the bucket array (e.g., `hash & (n - 1)`).
3. If the bucket at that index is empty, it stores the node there.
4. If there's a collision (bucket already has a node), it handles it using separate chaining. Before Java 8, this was always a linked list. From Java 8 onwards, if the linked list length exceeds a threshold (8), it is converted into a balanced tree (Red-Black Tree) to improve worst-case search time from O(n) to O(log n).

When you call `get(key)`:
1. It calculates the hash and determines the bucket index.
2. It traverses the linked list (or tree) at that bucket, using `equals()` to find the exact key.
3. If a match is found, it returns the value; otherwise, `null`.

### Life Analogy
Think of a post office with many numbered bins (buckets). When a package (key-value pair) arrives, the clerk looks at the zip code (hash code), does some math, and tosses it into a specific bin. If two packages end up in the same bin (collision), they are just stacked together. To find a package, the clerk calculates the bin number, goes to that bin, and checks the exact name (`equals()`) on the packages in the stack.

### Key Points
- Uses an array of buckets.
- Handles collisions with separate chaining (linked list).
- Converts linked lists to Red-Black trees after a threshold (8) since Java 8.
- Uses `hashCode()` to find the bucket and `equals()` to find the specific entry.
