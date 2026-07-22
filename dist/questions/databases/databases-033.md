---
id: databases-033
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 75%
source: Custom
prerequisites: ["Indexes"]
tags: [databases, spring-core]
---

# What is a Composite Index?
Explain what a Composite Index is and how column order affects its usage.

---ANSWER---

A Composite Index (or multi-column index) is an index created on two or more columns of a table.

**How column order matters (Left-Prefix Rule):**
The order in which columns are defined in a composite index is crucial. The database can use a composite index if the query's `WHERE` clause uses the columns from left to right.

Suppose you have an index on `(LastName, FirstName, Age)`.
- **Will use the index:** `WHERE LastName = 'Smith'`
- **Will use the index:** `WHERE LastName = 'Smith' AND FirstName = 'John'`
- **Will use the index:** `WHERE LastName = 'Smith' AND FirstName = 'John' AND Age = 30`
- **Will NOT use the index (efficiently):** `WHERE FirstName = 'John'` (Because it skips the first column).
- **Will NOT use the index:** `WHERE Age = 30`

Think of it like a telephone book sorted first by Last Name, then by First Name.

### Life Analogy
Imagine a physical filing cabinet sorted by State, then by City.
If someone asks you for files in "California", you can find that section instantly (Leftmost column).
If someone asks for "California, Los Angeles", you can find it instantly.
But if someone asks for files in "Los Angeles" without telling you the State, the filing system is useless to you. You have to open every single state drawer and look for Los Angeles (ignoring the leftmost column makes the index unusable).

### Key Points
- An index on multiple columns.
- Must follow the Left-Prefix rule to be utilized by the query optimizer.
- Put the most frequently queried and most selective columns first.
