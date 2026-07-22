---
id: mcq-col-001
topic: Collections
difficulty: Junior
format: MCQ
tags: ['collections', 'list']
---
Which implementation of the List interface works faster when inserting elements into the middle of the list?

A. ArrayList
B. LinkedList
C. Vector
D. CopyOnWriteArrayList

---ANSWER---
**Correct answer: B (LinkedList)**

### Key Points
- In a LinkedList, inserting a node requires only changing the references of neighboring nodes O(1) (after finding the position O(N)).
- In an ArrayList, inserting into the middle requires shifting all subsequent elements to the right O(N).
