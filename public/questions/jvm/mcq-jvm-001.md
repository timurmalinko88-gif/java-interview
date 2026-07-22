---
id: mcq-jvm-001
topic: JVM & Memory Management
difficulty: Junior
format: MCQ
tags: ['jvm', 'memory']
---
Where are primitive type local variables stored in Java?

A. Heap
B. Stack
C. Metaspace
D. String Pool

---ANSWER---
**Correct answer: B (Stack)**

### Key Points
- Local variables of primitive types (int, double, boolean, etc.) are stored in the Stack within the current method's frame.
- Objects are always created in the Heap, while only a reference to them is stored in the Stack.
