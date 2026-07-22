---
id: databases-046
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 85%
source: Custom
prerequisites: ["Transactions", "Locks"]
tags: ['databases']
---

# What is a Deadlock in a database?
Explain what a database deadlock is and how it occurs.

---ANSWER---

A deadlock is a situation where two or more concurrent transactions are waiting for each other to release database locks, resulting in a standstill. Neither transaction can proceed because each holds a lock the other needs.

**How it occurs:**
1.  **Transaction A** begins and updates `Table 1` (acquiring a lock on Table 1).
2.  **Transaction B** begins and updates `Table 2` (acquiring a lock on Table 2).
3.  **Transaction A** tries to update `Table 2`. It is blocked and must wait for Transaction B to release its lock.
4.  **Transaction B** tries to update `Table 1`. It is blocked and must wait for Transaction A to release its lock.
*Result:* Both are waiting indefinitely.

**Resolution:**
The Database Management System (DBMS) typically detects deadlocks automatically (e.g., via timeout or cycle detection in a wait-for graph). The DBMS will arbitrarily pick one transaction as the "victim," kill it (roll it back), and release its locks so the other transaction can finish. The application receives a Deadlock Exception and should handle it by retrying the rolled-back transaction.

### Life Analogy
Imagine two cars arriving at a narrow, one-lane bridge from opposite directions at the exact same time. Both drive onto the bridge. They meet in the middle. Car A cannot go forward until Car B backs up. Car B cannot go forward until Car A backs up. Neither will yield. They are deadlocked. The only solution is for a police officer (the DBMS) to force one car to reverse off the bridge so the other can pass.

### Key Points
- Two or more transactions blocking each other indefinitely.
- Occurs when transactions lock resources in different orders.
- The DBMS automatically detects this and kills one transaction.
