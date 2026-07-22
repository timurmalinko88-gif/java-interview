---
id: mcq-col-002
topic: Collections
difficulty: Middle
format: MCQ
tags: ['collections', 'map']
---
Starting from which Java version does HashMap use a red-black tree instead of a linked list to resolve collisions (upon reaching a certain threshold)?

A. Java 6
B. Java 7
C. Java 8
D. Java 9

---ANSWER---
**Correct answer: C (Java 8)**

### Key Points
- In Java 8, HashMap buckets containing 8 or more elements (TREEIFY_THRESHOLD) are transformed from a linked list into a Red-Black Tree, improving lookup time from O(n) to O(log n).
