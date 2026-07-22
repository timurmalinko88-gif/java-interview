---
id: databases-042
topic: Databases
difficulty: Middle
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["Spring", "Transactions"]
tags: ['databases']
---

# Explain Transaction Propagation in Spring/Java.
What is transaction propagation? Explain the difference between `REQUIRED` and `REQUIRES_NEW`.

---ANSWER---

Transaction Propagation determines how boundaries are defined when one transactional method calls another transactional method. It defines whether the called method should join the existing transaction, start a new one, or throw an error.

It is typically configured using the `@Transactional(propagation = ...)` annotation in Spring.

**Common Types:**

1.  **REQUIRED (Default):**
    - If an active transaction exists, the method joins it.
    - If no transaction exists, the method creates a new one.
    - *Use Case:* The standard setting. If `MethodA` calls `MethodB`, they both run in the same transaction. If `MethodB` fails, the whole thing rolls back.

2.  **REQUIRES_NEW:**
    - The method *always* starts a brand new transaction.
    - If an active transaction already exists, it is suspended until the new transaction completes.
    - *Use Case:* Logging or auditing. If `MethodA` does business logic and calls `MethodB` to write an audit log. You want the audit log to save (commit) even if `MethodA` later fails and rolls back.

3.  **SUPPORTS:** Joins if one exists; otherwise, runs non-transactionally.
4.  **MANDATORY:** Joins if one exists; otherwise, throws an Exception.

### Life Analogy
You are a manager who has a company credit card (Transaction). You send an employee to buy supplies.
- **REQUIRED:** You hand them your company card. They buy the supplies on your tab.
- **REQUIRES_NEW:** You tell them, "Use your own personal credit card for this specific purchase, regardless of what I'm doing." They start their own independent tab.

### Key Points
- Propagation defines behavior when transactional methods nest.
- `REQUIRED` (default) joins existing or creates new.
- `REQUIRES_NEW` suspends existing and always creates a new, independent transaction.
