---
id: databases-020
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 70%
source: Custom
prerequisites: ["SQL"]
tags: [oop, spring-core, system-design, databases, stream-api, multithreading, collections]
---

# What is a Stored Procedure?
Explain what a Stored Procedure is, and list its pros and cons compared to executing raw SQL from an application.

---ANSWER---

A Stored Procedure is a prepared SQL code that you can save in the database server, so the code can be reused over and over again. It can accept input parameters, execute complex logic (including IF/ELSE statements, loops, and multiple queries), and return result sets or output parameters.

**Pros:**
1.  **Performance:** The database engine compiles and optimizes the execution plan for the procedure, which is cached. Subsequent executions are faster than sending the same raw SQL string repeatedly. It also reduces network traffic since you only send the procedure name and parameters, not the whole query.
2.  **Security:** You can grant users execute permissions on a procedure without granting them direct `SELECT/UPDATE` permissions on the underlying tables. This prevents SQL injection and enforces data access rules.
3.  **Reusability:** Business logic centralized in the database can be called by multiple different applications (Java, Python, C#) without rewriting the logic in each language.

**Cons:**
1.  **Vendor Lock-in:** Stored procedure languages (PL/pgSQL for Postgres, T-SQL for SQL Server, PL/SQL for Oracle) are proprietary. Migrating to a different database engine requires rewriting all procedures.
2.  **Maintainability/Debugging:** It is often harder to debug and version-control stored procedures compared to application code (Java).
3.  **Business Logic Leakage:** Placing too much business logic in the database violates the separation of concerns. The database should ideally focus on data storage/retrieval, while the application layer handles business rules.

### Life Analogy
Imagine a restaurant kitchen.
- **Raw SQL:** The waiter walks into the kitchen and dictates the entire recipe for a burger to the chef step-by-step every single time an order is placed.
- **Stored Procedure:** The chef has a recipe book. The waiter just yells, "Make a Burger, Order #5!" (calling the procedure with a parameter). The chef already knows the steps, making it much faster and less prone to the waiter making a mistake in the instructions.

### Key Points
- A Stored Procedure is compiled, reusable SQL code saved on the database server.
- Pros: Performance, security, reduced network traffic.
- Cons: Vendor lock-in, harder debugging, leaks business logic into the data tier.
