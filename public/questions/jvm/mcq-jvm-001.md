---
id: mcq-jvm-001
topic: JVM & Memory Management
difficulty: Junior
format: MCQ
tags: [jvm, memory, stack]
---
Где хранятся локальные переменные примитивных типов в Java?

A. Heap (Куча)
B. Stack (Стек)
C. Metaspace
D. String Pool

---ANSWER---
**Правильный ответ: B (Stack)**

### Key Points
- Локальные переменные примитивных типов (int, double, boolean и т.д.) хранятся в стеке (Stack) в рамках текущего фрейма метода.
- Объекты всегда создаются в куче (Heap), а в стеке хранится лишь ссылка на них.
