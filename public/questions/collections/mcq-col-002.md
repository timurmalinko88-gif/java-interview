---
id: mcq-col-002
topic: Collections
difficulty: Middle
format: MCQ
tags: [collections, map, hashmap]
---
С какой версии Java в HashMap для разрешения коллизий (при достижении определенного порога) вместо связного списка используется красно-черное дерево?

A. Java 6
B. Java 7
C. Java 8
D. Java 9

---ANSWER---
**Правильный ответ: C (Java 8)**

### Key Points
- В Java 8 бакеты HashMap, содержащие 8 и более элементов (TREEIFY_THRESHOLD), преобразуются из связного списка в красно-черное дерево (Red-Black Tree), улучшая время поиска с O(n) до O(log n).
