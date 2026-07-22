---
id: mcq-core-002
topic: General
difficulty: Middle
format: MCQ
tags: []
---
Which requirement for the equals() and hashCode() contract is correct?

A. If the hash codes of two objects are equal, the objects are always equal according to equals
B. If objects are equal according to equals, their hash codes must necessarily be equal
C. If hash codes are different, the objects can be equal according to equals
D. There is no strict dependency between these methods

---ANSWER---
**Correct answer: B**

### Key Points
- The main rule: `a.equals(b) == true` => `a.hashCode() == b.hashCode()`.
- The reverse is not true: the same hash code does not guarantee object equality (a collision occurs).
