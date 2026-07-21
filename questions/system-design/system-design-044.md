---
id: system-design-044
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 75%
source: Custom
prerequisites: ["Databases", "Concurrency"]
---

# Database Deadlocks

What is a database deadlock? Provide an example of how it occurs, and explain how databases handle it and how developers prevent it.

---ANSWER---

A **Deadlock** occurs when two or more transactions are waiting for each other to release a lock, resulting in a circular dependency. Neither transaction can proceed, and they will wait forever unless the database intervenes.

**Example Scenario:**
- **Transaction A** locks Row 1 and needs to lock Row 2 to finish.
- **Transaction B** locks Row 2 and needs to lock Row 1 to finish.
- *Result*: Transaction A waits for B, and Transaction B waits for A. Deadlock.

**How Databases Handle It:**
Modern relational databases (like Postgres and MySQL) have Deadlock Detectors. They constantly check the lock graph for cycles. If a cycle is detected, the database arbitrarily chooses one of the transactions as the "victim," rolls it back, and throws a Deadlock Error. This releases the locks and allows the other transaction to proceed.

**How Developers Prevent It:**
1. **Consistent Lock Ordering**: The most effective way to prevent deadlocks is to ensure all application code requests locks in the exact same order. If Transaction A and B both lock Row 1 *then* Row 2, a deadlock is mathematically impossible (B will just wait for A to finish).
2. **Keep Transactions Short**: The longer a transaction takes, the higher the chance it will collide with another.
3. **Appropriate Isolation Levels**: Using lower isolation levels (like Read Committed instead of Serializable) reduces the strictness of locking, though it introduces other anomalies.

### Life Analogy
Imagine two cars arriving at a narrow, one-lane bridge from opposite directions. Car A gets on the bridge (Row 1 lock), and Car B gets on the bridge (Row 2 lock). They meet in the middle. Car A can't move forward until Car B backs up, and Car B can't move forward until Car A backs up. The police (Database) have to force one car to reverse (Rollback) so the other can pass.

### Key Points
- Occurs when two transactions hold locks the other needs, creating an infinite wait.
- Databases automatically detect cycles and abort one transaction.
- Prevented by acquiring resources/locks in a consistent, alphabetical or numerical order.
