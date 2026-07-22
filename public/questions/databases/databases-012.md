---
id: databases-012
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 70%
source: Custom
prerequisites: ["Database Design"]
tags: ['databases']
---

# Explain First Normal Form (1NF).
What are the rules for a database table to be in First Normal Form (1NF)?

---ANSWER---

First Normal Form (1NF) is the foundational rule of database normalization. It sets the basic rules for structuring a relational database table.

For a table to be in 1NF, it must satisfy the following conditions:

1.  **Atomic Values (No Repeating Groups):** Each column in a table must contain only single, indivisible values (atomic values). You cannot have an array, a list, or multiple values separated by commas in a single cell.
    - *Violation Example:* A column named `Phone_Numbers` containing "555-1234, 555-9876".
    - *Fix:* Create a separate table for phone numbers linked back to the user, or (less ideally) have `Phone1`, `Phone2` columns.
2.  **Unique Rows:** Each row must be unique. This is typically achieved by having a Primary Key.
3.  **Single Data Type per Column:** All values in a specific column must be of the same data type.

### Life Analogy
Think of an Excel spreadsheet tracking employees and their skills.
- **Not 1NF:** You have a row for "Alice" and in the "Skills" column you type "Java, Python, SQL".
- **1NF:** You are forced to put only one piece of data per cell. You might have three rows for Alice: one for Java, one for Python, one for SQL. (Though practically, you'd make a separate Skills table to avoid duplicating Alice's other info).

### Key Points
- 1NF requires atomic values in every column.
- No repeating groups or arrays within a single cell.
- Requires unique rows (a primary key).
