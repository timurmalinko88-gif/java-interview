---
id: spring-033
topic: Spring
difficulty: Senior
format: Open Answer
time: 6
frequency: 60%
source: Custom
prerequisites: ["@Transactional", "Databases"]
tags: [databases, spring-core, multithreading]
---

# What are Transaction Isolation Levels in Spring?
Explain what Transaction Isolation levels are and how they relate to the `@Transactional` annotation. What problems do they solve?

---ANSWER---

**Transaction Isolation** defines how changes made by one transaction become visible to other concurrent transactions running at the same time. It is a fundamental database concept (the 'I' in ACID) that Spring allows you to configure via `@Transactional(isolation = ...)`.

It solves concurrency problems like:
-   **Dirty Reads:** Reading uncommitted changes from another transaction.
-   **Non-Repeatable Reads:** Reading the same row twice in one transaction and getting different data because another transaction updated it in between.
-   **Phantom Reads:** Executing the same query twice and getting a different number of rows because another transaction inserted/deleted rows in between.

**Isolation Levels (from least to most strict):**

1.  **`DEFAULT`:** Uses the default isolation level of the underlying database (e.g., usually `READ_COMMITTED` for PostgreSQL/SQL Server, `REPEATABLE_READ` for MySQL InnoDB).
2.  **`READ_UNCOMMITTED`:** Lowest isolation. Allows Dirty Reads. Rarely used.
3.  **`READ_COMMITTED`:** Prevents Dirty Reads. A transaction can only read data that has been committed. (Most common default).
4.  **`REPEATABLE_READ`:** Prevents Dirty Reads and Non-Repeatable Reads. Guarantees that if you read a row, it will not change for the duration of your transaction.
5.  **`SERIALIZABLE`:** Highest isolation. Prevents all concurrency issues (including Phantom Reads) by essentially executing transactions sequentially. Has the worst performance/highest risk of deadlocks.

### Life Analogy
You and a colleague are editing the same Google Doc.
-   **Read Uncommitted:** You see their typos as they type them, before they hit save.
-   **Read Committed:** You only see their changes after they hit "Save".
-   **Repeatable Read:** You download a PDF copy of the document. No matter what they do to the live doc, your PDF stays exactly the same while you read it.
-   **Serializable:** Only one person is allowed in the document at a time. The other person is locked out until you close it.

### Key Points
- Isolation manages visibility of data between concurrent transactions.
- Prevents Dirty, Non-Repeatable, and Phantom reads.
- `DEFAULT` relies on the database's configured default.
- Higher isolation = safer data but worse performance.
