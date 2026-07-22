---
id: mcq-db-002
topic: Databases
difficulty: Senior
format: MCQ
tags: ['sql']
---
Какой уровень изоляции транзакций решает проблему "Фантомного чтения" (Phantom Read)?

A. READ UNCOMMITTED
B. READ COMMITTED
C. REPEATABLE READ
D. SERIALIZABLE

---ANSWER---
**Правильный ответ: D (SERIALIZABLE)**

### Key Points
- Phantom Read возникает, когда другая транзакция добавляет или удаляет строки, удовлетворяющие условию запроса текущей транзакции.
- Изоляция уровня SERIALIZABLE блокирует диапазон строк, предотвращая фантомные чтения (однако сильно снижает производительность).
