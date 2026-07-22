---
id: collections-040
topic: Collections
difficulty: Middle
format: Code Review
time: 5
frequency: 80%
source: Custom
prerequisites: ["Hashing", "Big O Notation"]
tags: ['collections']
---

# Time Complexity of HashMap
What is the time complexity of `put()` and `get()` operations in a `HashMap`? What causes it to degrade?

---ANSWER---

The time complexity of `HashMap` operations depends heavily on the hash function and load factor.

1. **Average/Best Case**: 
   Both `put()` and `get()` have an **O(1)** (constant) time complexity. Assuming a good hash function distributes keys evenly across buckets, finding the bucket is a quick mathematical operation, and the bucket will only contain one or two elements.

2. **Worst Case**:
   If a poor hash function is used (e.g., returning the same hash code for every object), all keys will collide and end up in the exact same bucket.
   - **Before Java 8**: The bucket becomes a long linked list. Searching or adding requires traversing this list, degrading performance to **O(n)**.
   - **Java 8 and later**: When a bucket's linked list reaches a certain threshold (usually 8 elements), it transforms into a Red-Black tree. This limits the worst-case degradation to **O(log n)**, which is significantly better than O(n) for large datasets.

### Life Analogy
O(1) is having a perfectly organized filing cabinet. You instantly jump to the 'S' folder and grab the file for 'Smith'.
O(n) is taking all your files out of the cabinet and dumping them in one massive pile on the floor. To find 'Smith', you have to read every single file from the top to the bottom.

### Key Points
- Best/Average Case: O(1).
- Worst Case (pre-Java 8): O(n) due to linked list collisions.
- Worst Case (Java 8+): O(log n) due to Red-Black tree conversion.
