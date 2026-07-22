---
id: databases-006
topic: Databases
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["SQL"]
tags: ['databases']
---

# Explain the difference between DELETE, TRUNCATE, and DROP commands.
What are the differences between `DELETE`, `TRUNCATE`, and `DROP` in SQL? Include aspects like rollback capability, performance, and structure retention.

---ANSWER---

1.  **DELETE:**
    - A Data Manipulation Language (DML) command.
    - Used to remove one, some, or all rows from a table based on a `WHERE` clause.
    - **Rollback:** Can be rolled back if executed within a transaction.
    - **Performance:** Slower because it logs each row deletion in the transaction log.
    - **Structure:** Keeps the table structure and its data pages intact. Triggers are fired.

2.  **TRUNCATE:**
    - A Data Definition Language (DDL) command (in most databases, though it acts like DML).
    - Removes all rows from a table quickly. You cannot use a `WHERE` clause.
    - **Rollback:** In some databases (like SQL Server or PostgreSQL), it can be rolled back if in a transaction. In others (like MySQL/InnoDB), it cannot.
    - **Performance:** Much faster than `DELETE` because it deallocates the data pages instead of logging individual row deletions.
    - **Structure:** Keeps the table structure, but resets identity columns (auto-increments) to their seed value. Triggers are not fired.

3.  **DROP:**
    - A Data Definition Language (DDL) command.
    - Completely removes the table structure, data, indexes, constraints, and permissions from the database.
    - **Rollback:** Generally cannot be rolled back.
    - **Performance:** Very fast.
    - **Structure:** The table is gone entirely.

### Life Analogy
Think of a notebook full of pages with notes.
- **DELETE:** Taking an eraser and rubbing out specific lines or entire pages, one by one. You still have the notebook and the blank pages.
- **TRUNCATE:** Ripping all the pages out of the notebook and throwing them away. You still have the notebook cover, but it's empty, and you start numbering pages from 1 again.
- **DROP:** Throwing the entire notebook into a fire. It's completely gone.

### Key Points
- DELETE is DML, row-by-row, and slower.
- TRUNCATE is DDL, removes all rows instantly, and resets auto-increments.
- DROP is DDL and completely deletes the table structure and data.
