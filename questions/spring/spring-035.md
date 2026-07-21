---
id: spring-035
topic: Spring
difficulty: Middle
format: Open Answer
time: 4
frequency: 70%
source: Custom
prerequisites: ["@Transactional"]
tags: [spring-core, databases, memory, multithreading, collections, spring-data, exceptions]
---

# Why use @Transactional(readOnly = true)?
What is the purpose of setting `readOnly = true` on the `@Transactional` annotation? What benefits does it provide?

---ANSWER---

Setting `@Transactional(readOnly = true)` serves two main purposes: it acts as an optimization hint for the underlying database and ORM, and it communicates intent to other developers.

**Benefits:**

1.  **Performance Optimization (Hibernate/JPA):** 
    -   When Hibernate knows a transaction is read-only, it disables **dirty checking**. Normally, Hibernate keeps a snapshot of every entity loaded in the session to compare it at the end of the transaction to generate UPDATE statements. Disabling this saves memory and CPU cycles.
    -   Hibernate won't flush the session to the database.
2.  **Database Optimization:** 
    -   Spring passes the read-only hint down to the JDBC connection. Depending on the specific database vendor, the database might apply optimizations (like using lighter read locks or routing the query to a read-replica database).
3.  **Code Semantics / Intent:** 
    -   It clearly signals to anyone reading the code that this method is not supposed to modify data. If someone tries to add a `save()` call inside this method, some database drivers will actually throw an exception, preventing accidental data modification.

**When to use it:**
Use it on any service method that only performs `SELECT` queries (e.g., `findById`, `findAll`, search operations).

### Life Analogy
Entering a museum with a "Look but don't touch" policy (`readOnly = true`). 
Because the security guards know you aren't allowed to touch anything, they don't have to follow you around closely (no dirty checking, saving energy). If you do try to touch a painting, the alarm immediately goes off (exception thrown).

### Key Points
- Disables Hibernate dirty checking (saves CPU/Memory).
- Prevents accidental data modifications.
- Can help databases optimize locking or route to read-replicas.
- Apply to all methods that only perform data retrieval.
