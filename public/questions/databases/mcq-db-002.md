---
id: mcq-db-002
topic: Databases
difficulty: Senior
format: MCQ
tags: ['sql']
---
Which transaction isolation level solves the "Phantom Read" problem?

A. READ UNCOMMITTED
B. READ COMMITTED
C. REPEATABLE READ
D. SERIALIZABLE

---ANSWER---
**Correct answer: D (SERIALIZABLE)**

### Key Points
- A Phantom Read occurs when another transaction adds or removes rows that satisfy the query condition of the current transaction.
- The SERIALIZABLE isolation level locks a range of rows, preventing phantom reads (however, it significantly reduces performance).
