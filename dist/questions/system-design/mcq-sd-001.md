---
id: mcq-sd-001
topic: System Design
difficulty: Middle
format: MCQ
tags: [system-design, cap]
---
Согласно CAP-теореме, распределенная система может гарантировать не более двух из трех свойств. Какие это свойства?

A. Consistency, Availability, Partition Tolerance
B. Cacheability, Atomicity, Performance
C. Concurrency, Availability, Persistence
D. Consistency, Asynchrony, Partition Tolerance

---ANSWER---
**Правильный ответ: A**

### Key Points
- **C (Consistency)**: каждое чтение получает самую последнюю запись или ошибку.
- **A (Availability)**: каждый запрос получает ответ (без гарантии свежести данных).
- **P (Partition Tolerance)**: система продолжает работу несмотря на обрыв сети между узлами.
