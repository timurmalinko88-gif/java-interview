---
id: databases-004
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 80%
source: Custom
prerequisites: ["SQL", "Relational Databases"]
tags: [databases, spring-core, spring-data]
---

# What is the difference between a Primary Key and a Unique Key?
Explain the main differences between a Primary Key constraint and a Unique Key constraint in a relational database.

---ANSWER---

Both Primary Keys (PK) and Unique Keys (UK) are used to ensure the uniqueness of values in a column or a group of columns, but they have distinct purposes and rules.

Here are the key differences:

1.  **Purpose:**
    - **Primary Key:** Uniquely identifies a specific record (row) in a table. It is the definitive identifier for that entity.
    - **Unique Key:** Ensures that all values in a specific column (or combination of columns) are distinct from one another. It's often used for alternate identifiers (e.g., an employee's email address or social security number).

2.  **Number per Table:**
    - **Primary Key:** A table can have **only one** Primary Key.
    - **Unique Key:** A table can have **multiple** Unique Keys.

3.  **NULL Values:**
    - **Primary Key:** Does **not** allow `NULL` values. Every row must have a valid, non-null value for its primary key.
    - **Unique Key:** Generally allows `NULL` values (the exact behavior can depend slightly on the specific RDBMS, but standard SQL allows them). Usually, multiple `NULL` values are considered distinct, meaning you can have multiple rows with a `NULL` in a unique column.

4.  **Indexing:**
    - **Primary Key:** By default, creating a primary key automatically creates a **Clustered Index** on those columns in most relational databases (like SQL Server and MySQL/InnoDB), physically sorting the data on disk.
    - **Unique Key:** By default, creating a unique key automatically creates a **Non-Clustered Index**.

### Life Analogy
Think of a citizen in a country.
- **Primary Key:** This is the citizen's unique National ID Number. Everyone must have one, no one can have a blank (NULL) one, and it is the main way the government identifies you.
- **Unique Key:** This is the citizen's Passport Number or Driver's License Number. It also uniquely identifies a person, but you might not have one (it can be NULL), and a person can have multiple different unique identifiers (multiple unique constraints).

### Key Points
- Only one Primary Key is allowed per table; multiple Unique Keys are allowed.
- Primary Keys cannot contain NULL values; Unique Keys typically allow NULLs.
- Primary Keys often default to Clustered Indexes; Unique Keys default to Non-Clustered Indexes.
