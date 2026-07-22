---
id: databases-009
topic: Databases
difficulty: Middle
format: Open Answer
time: 6
frequency: 80%
source: Custom
prerequisites: ["SQL", "Indexes"]
tags: ['databases']
---

# Clustered vs. Non-Clustered Indexes.
What is the difference between a Clustered Index and a Non-Clustered Index?

---ANSWER---

Indexes are database structures used to speed up data retrieval operations. The core difference between clustered and non-clustered indexes lies in how the actual table data is stored physically.

1.  **Clustered Index:**
    - **Data Storage:** The clustered index dictates the physical order of the data rows in the table. The leaf nodes of the index contain the actual data rows.
    - **Quantity:** Because the data rows themselves can only be sorted in one physical order, a table can have **only one** clustered index.
    - **Default:** By default, creating a Primary Key constraint creates a clustered index on those columns.
    - **Performance:** Very fast for retrieving ranges of data or sequentially accessing data, because once the starting point is found, the rest of the data is physically contiguous.
    - **Drawback:** Updating the clustered index column (or inserting/deleting) can be expensive, as it might require physically moving data rows to maintain the sort order (page splits).

2.  **Non-Clustered Index:**
    - **Data Storage:** A non-clustered index is a separate structure from the data rows. It contains the index key values and a pointer (a row locator) to the actual data row in the table. (If a clustered index exists, the pointer is usually the clustered index key).
    - **Quantity:** A table can have **multiple** non-clustered indexes.
    - **Default:** By default, creating a Unique Key constraint creates a non-clustered index.
    - **Performance:** Faster for exact-match lookups. Slower than clustered for range queries because it requires an extra step: finding the index entry and then following the pointer to fetch the actual row data (a "bookmark lookup" or "key lookup").

### Life Analogy
Think of a physical book.
- **Clustered Index:** This is like the Table of Contents or the actual pages of a dictionary. The contents of the book are physically sorted in order (page 1, 2, 3 or A, B, C). You can only sort a book one way physically.
- **Non-Clustered Index:** This is like the Index at the back of the book. It lists topics alphabetically and gives you a page number (a pointer) to go look up the actual information. You can have multiple indexes at the back (e.g., an index by topic, an index by author name).

### Key Points
- Clustered index determines the physical sort order of data rows (max 1 per table).
- Non-clustered index is a separate structure with pointers to the data rows (multiple allowed).
- Primary keys default to Clustered; Unique keys default to Non-clustered.
