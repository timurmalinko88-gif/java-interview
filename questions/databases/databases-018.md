---
id: databases-018
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 95%
source: Custom
prerequisites: ["SQL"]
tags: [spring-core, memory, collections, databases]
---

# What is a Foreign Key?
Explain the concept of a Foreign Key and its purpose in a relational database.

---ANSWER---

A Foreign Key is a column (or a set of columns) in one table that refers to the Primary Key (or a unique key) in another table.

**Purpose:**
Its primary purpose is to enforce **Referential Integrity**. It ensures that the relationships between tables remain consistent.

**Rules enforced by Foreign Keys:**
1.  **Insertion/Update:** You cannot insert a value into the foreign key column if that value does not exist in the referenced primary key column. (e.g., You can't create an `Order` for a `CustomerID` that doesn't exist).
2.  **Deletion:** You cannot delete a record from the parent table if there are dependent records in the child table (unless you configure cascading deletes). (e.g., You can't delete a `Customer` if they still have `Orders` associated with them).

### Life Analogy
Imagine a library system.
The "Books" table has a primary key: Book ID.
The "Checkouts" table tracks who borrowed what. It has a column for "Book ID". This is the **Foreign Key**.
Referential integrity means the librarian physically cannot enter a checkout record for a Book ID that doesn't exist in the library catalog.

### Key Points
- A foreign key links a column in one table to the primary key of another.
- It enforces referential integrity.
- It prevents orphan records by restricting invalid inserts and deletes.
