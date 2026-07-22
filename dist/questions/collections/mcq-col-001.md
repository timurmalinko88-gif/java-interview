---
id: mcq-col-001
topic: Collections
difficulty: Junior
format: MCQ
tags: [collections, list]
---
Какая реализация интерфейса List работает быстрее при вставке элементов в середину списка?

A. ArrayList
B. LinkedList
C. Vector
D. CopyOnWriteArrayList

---ANSWER---
**Правильный ответ: B (LinkedList)**

### Key Points
- В LinkedList вставка узла требует только изменения ссылок у соседних узлов O(1) (после нахождения позиции O(N)).
- В ArrayList вставка в середину требует сдвига всех последующих элементов вправо O(N).
