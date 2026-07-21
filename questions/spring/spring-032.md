---
id: spring-032
topic: Spring
difficulty: Senior
format: Open Answer
time: 8
frequency: 80%
source: Custom
prerequisites: ["@Transactional"]
tags: [spring-core, memory, exceptions, databases]
---

# What are the Spring Transaction Propagation behaviors?
Explain the concept of Transaction Propagation in Spring. Describe the most commonly used propagation types (`REQUIRED`, `REQUIRES_NEW`, `NESTED`).

---ANSWER---

**Transaction Propagation** defines how a transactional method behaves when it is called by another method that may or may not already have an active transaction. It dictates whether the called method should join the existing transaction, start a new one, or throw an exception.

Common Propagation Types:

1.  **`REQUIRED` (Default):**
    -   If a transaction already exists, the method joins that transaction.
    -   If no transaction exists, a new one is created.
    -   *Use Case:* The standard, safe default for most business logic.
2.  **`REQUIRES_NEW`:**
    -   Always starts a *brand new* independent transaction.
    -   If an existing transaction exists, it is suspended (put on hold) until the new transaction completes. 
    -   *Use Case:* Logging or auditing. Even if the main business transaction rolls back, the audit log transaction should still commit independently.
3.  **`MANDATORY`:**
    -   Must run within an existing transaction. If none exists, it throws an exception.
4.  **`SUPPORTS`:**
    -   If a transaction exists, it joins it. If not, it executes non-transactionally.
5.  **`NOT_SUPPORTED`:**
    -   Executes non-transactionally. If a transaction exists, it suspends it.
6.  **`NEVER`:**
    -   Must execute non-transactionally. If a transaction exists, it throws an exception.
7.  **`NESTED`:**
    -   If a transaction exists, it executes within a "nested" transaction using database savepoints. If the nested transaction rolls back, it only rolls back to the savepoint; the outer transaction can still commit. If no transaction exists, it behaves like `REQUIRED`.

### Life Analogy
You (Method A) are cooking dinner (Transaction A), and you ask your roommate (Method B) to go to the store.
-   **`REQUIRED`:** Roommate buys groceries for the dinner. (Joined together).
-   **`REQUIRES_NEW`:** Roommate says "I'm going to buy my own separate lottery ticket." (Independent. Even if dinner burns, they keep the ticket).
-   **`MANDATORY`:** Roommate says "I'll only go if you are currently cooking, otherwise no."
-   **`NESTED`:** Roommate buys a dessert. If the dessert drops on the floor (fails), dinner is still fine. But if dinner burns (outer fails), the dessert is thrown away too.

### Key Points
- Propagation dictates how transactions interact across method calls.
- `REQUIRED` is the default (joins or creates).
- `REQUIRES_NEW` always creates a new, independent transaction.
- `NESTED` relies on DB savepoints (partial rollback).
