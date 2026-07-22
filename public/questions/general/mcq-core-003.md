---
id: mcq-core-003
topic: General
difficulty: Middle
format: MCQ
tags: ['generics']
---
What is Type Erasure in Java Generics?

A. Removal of unused generic classes by the garbage collector
B. The process by which the compiler replaces all type parameters with their bounds (or Object) and inserts type casts in the bytecode
C. An IDE feature for hiding complex types
D. A Runtime Error

---ANSWER---
**Correct answer: B**

### Key Points
- Generics were added in Java 5 with a backward compatibility requirement. Therefore, at runtime, the JVM does not know about `<T>` types; they are "erased" by the compiler.
