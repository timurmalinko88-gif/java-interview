---
id: databases-003
topic: Databases
difficulty: Senior
format: Open Answer
time: 10
frequency: 90%
source: Custom
prerequisites: ["SQL", "Transactions", "ACID"]
---

# Explain the different Transaction Isolation Levels and the anomalies they prevent.
What are the standard SQL transaction isolation levels? Explain the concurrency anomalies (Dirty Read, Non-Repeatable Read, Phantom Read) and how each isolation level addresses them.

---ANSWER---

Transaction isolation levels define the degree to which a transaction is isolated from the data modifications made by other concurrent transactions. They represent a trade-off between data consistency and concurrency (performance).

**Concurrency Anomalies:**
1.  **Dirty Read:** Transaction A reads data that has been modified by Transaction B, but Transaction B has not yet committed. If Transaction B rolls back, Transaction A has read data that "never existed."
2.  **Non-Repeatable Read:** Transaction A reads the same row twice. Between the two reads, Transaction B modifies or deletes that row and commits. Transaction A gets different results for the same row in the same transaction.
3.  **Phantom Read:** Transaction A executes a query that returns a set of rows matching a condition. Transaction B then inserts or deletes rows that match that condition and commits. When Transaction A re-executes the query, it sees a different set of rows (the "phantoms").

**Standard SQL Isolation Levels:**

1.  **READ UNCOMMITTED:**
    - The lowest level. Allows transactions to read uncommitted changes from other transactions.
    - **Prevents:** Nothing.
    - **Allows:** Dirty Reads, Non-Repeatable Reads, Phantom Reads.
    - **Use Case:** Rarely used, only when performance is critical and data accuracy is not.

2.  **READ COMMITTED:**
    - A transaction can only read data that has been committed.
    - **Prevents:** Dirty Reads.
    - **Allows:** Non-Repeatable Reads, Phantom Reads.
    - **Use Case:** The default isolation level for many databases (e.g., PostgreSQL, Oracle, SQL Server). Good balance of consistency and concurrency.

3.  **REPEATABLE READ:**
    - Ensures that if a transaction reads a row, it will see the same data if it reads that row again, even if other transactions modify it. It typically achieves this by placing read locks on rows.
    - **Prevents:** Dirty Reads, Non-Repeatable Reads.
    - **Allows:** Phantom Reads.
    - **Use Case:** Default in MySQL/InnoDB. Useful when calculations are based on data that shouldn't change during the transaction.

4.  **SERIALIZABLE:**
    - The highest isolation level. It guarantees that the effect of concurrent transactions is identical to executing them serially (one after another). This often involves range locks or table locks.
    - **Prevents:** Dirty Reads, Non-Repeatable Reads, Phantom Reads.
    - **Allows:** Nothing (highest consistency).
    - **Use Case:** Financial transactions or critical operations where absolute consistency is required, but it significantly reduces concurrency and increases the risk of deadlocks.

### Life Analogy
Imagine reading a shared draft document while someone else is editing it.
- **READ UNCOMMITTED:** You read their sentences as they type them, even before they hit "save" (Dirty Read risk if they delete it).
- **READ COMMITTED:** You only see sentences after they hit "save." But if you reread a paragraph later, it might have changed (Non-repeatable read).
- **REPEATABLE READ:** When you start reading, you get a frozen copy of the existing paragraphs. They can't change what you've already read. But if they add a brand new paragraph at the end, you might suddenly see it next time you look (Phantom read).
- **SERIALIZABLE:** You lock the entire room. No one else can even enter to edit the document until you are completely finished reading.

### Key Points
- Isolation levels balance data consistency against concurrency performance.
- Dirty Read: Reading uncommitted data.
- Non-Repeatable Read: Reading the same row twice and getting different committed data.
- Phantom Read: Re-running a query and getting a different set of rows due to committed inserts/deletes.
- The four levels are Read Uncommitted, Read Committed, Repeatable Read, and Serializable.
