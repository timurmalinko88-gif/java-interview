---
id: databases-005
topic: Databases
difficulty: Senior
format: Open Answer
time: 8
frequency: 85%
source: Custom
prerequisites: ["SQL", "Transactions", "Concurrency"]
tags: [spring-core, databases, stream-api, multithreading, collections, exceptions]
---

# Explain Optimistic vs. Pessimistic Locking.
What are the differences between optimistic locking and pessimistic locking? When would you choose to use one over the other?

---ANSWER---

Optimistic and pessimistic locking are two strategies used to handle concurrent access to data in a database, preventing lost updates and ensuring consistency.

**1. Pessimistic Locking:**
- **Concept:** "Assume the worst." It assumes that conflicts are highly likely. Therefore, when a transaction reads data it intends to modify, it immediately places a physical lock on that data in the database.
- **Mechanism:** Usually implemented using database-level locking clauses like `SELECT ... FOR UPDATE`. No other transaction can read (in some modes) or update the locked data until the first transaction commits or rolls back.
- **Pros:** Guarantees data integrity by preventing conflicts before they happen. Avoids transaction rollbacks due to conflict.
- **Cons:** Can severely reduce concurrency and performance. It holds database locks for the duration of the transaction, increasing the risk of deadlocks and blocking other users.

**2. Optimistic Locking:**
- **Concept:** "Assume the best." It assumes that conflicts are rare. It allows multiple transactions to read and edit the same data concurrently without placing physical locks.
- **Mechanism:** It typically uses a `version` number or a `timestamp` column on the table.
    - Transaction A reads the row (including `version = 1`).
    - Transaction A modifies the data locally.
    - When Transaction A tries to update, it checks if the version in the database is still `1`.
    - `UPDATE table SET ..., version = 2 WHERE id = X AND version = 1`
    - If the update affects 0 rows, it means another transaction updated the row in the meantime (the version changed). An `OptimisticLockException` (or similar) is thrown, and the application must handle it (usually by retrying).
- **Pros:** Excellent performance and high concurrency because no physical locks are held during the user "think time" or transaction processing. Avoids database deadlocks.
- **Cons:** When conflicts do occur, the application must handle the failure, typically by forcing the user to restart the operation.

**When to choose which?**
- Use **Optimistic Locking** in systems with high read-to-write ratios where data collisions are infrequent (most typical web applications). It scales much better.
- Use **Pessimistic Locking** in systems where data collisions are very frequent, or where the cost of rolling back and retrying a transaction is extremely high (e.g., complex financial calculations, inventory reservation systems).

### Life Analogy
Imagine a shared document at work.
- **Pessimistic:** You check out the document and lock the file. No one else can even open it until you check it back in. Safe, but frustrating for others if you take a long lunch break.
- **Optimistic:** You download a copy, edit it, and when you try to upload it, the system checks if anyone else uploaded a newer version while you were working. If they did, it rejects your upload and says, "Please merge your changes with the new version."

### Key Points
- Pessimistic locking locks data physically in the database upon reading; Optimistic locking checks for conflicts only at the time of the update.
- Optimistic locking uses version numbers or timestamps.
- Optimistic locking is preferred for high-concurrency, low-collision environments.
- Pessimistic locking is preferred for high-collision environments where retries are expensive.
