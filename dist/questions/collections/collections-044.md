---
id: collections-044
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 65%
source: Custom
prerequisites: ["Hashing"]
tags: ['collections']
---

# Hash Collision Resolution
How does a `HashMap` handle hash collisions?

---ANSWER---

A hash collision occurs when two different keys generate the exact same hash code, or when two different hash codes map to the exact same bucket index in the `HashMap`'s internal array.

Java handles collisions using a technique called **Separate Chaining**.

**How it works:**
1. Each bucket in the array does not just hold a single value; it holds the `head` of a data structure.
2. When a collision occurs, the new key-value pair (Node) is appended to the existing structure in that bucket.
3. **Pre-Java 8**: The structure was always a singly-linked list. The new node was just added to the end of the list. Finding an element required traversing the list, resulting in O(n) time.
4. **Java 8+**: To protect against degraded performance (especially Denial of Service attacks using forced collisions), Java 8 introduced the `TREEIFY_THRESHOLD`. If the linked list in a bucket reaches 8 elements, the list is transformed into a balanced Red-Black Tree. This improves worst-case lookup from O(n) to O(log n). If elements are removed and the tree shrinks below 6 elements, it converts back to a linked list.

### Life Analogy
Imagine a mailroom with numbered cubbies. Two packages arrive with the exact same cubby number (Collision). Instead of throwing one away, the clerk just chains them together with string and shoves them both in the cubby. If the chain gets ridiculously long (8 packages), the clerk takes them out and builds a mini filing cabinet (Tree) inside the cubby to keep them organized.

### Key Points
- Solved using Separate Chaining.
- Uses linked lists by default.
- Upgrades to Red-Black trees after 8 collisions in a single bucket (Java 8+).
