---
id: databases-032
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 85%
source: Custom
prerequisites: ["Indexes"]
tags: ['databases']
---

# What are the drawbacks of adding too many indexes?
If indexes speed up database queries, why shouldn't we just index every column in a table?

---ANSWER---

While indexes dramatically improve `SELECT` query performance (reads), they impose significant overhead on `INSERT`, `UPDATE`, and `DELETE` operations (writes).

**Drawbacks of too many indexes:**
1.  **Write Performance Degradation:** Every time you insert a new row, or update an indexed column, or delete a row, the database engine must not only update the table data but also update *every single index* associated with that table. If a table has 10 indexes, one insert operation becomes 11 operations under the hood.
2.  **Storage Space:** Indexes are physical data structures stored on disk. They consume storage space. In some cases, the indexes for a table can take up more disk space than the actual table data itself.
3.  **Maintenance Overhead:** When the database statistics change or indexes become fragmented, they require maintenance (rebuilding or reorganizing) which consumes CPU and I/O resources.

**Conclusion:** Indexing requires a balance. You should only index columns that are frequently used in `WHERE`, `JOIN`, or `ORDER BY` clauses.

### Life Analogy
Imagine a library book. 
An index is the index section at the back of the book. It helps you find topics quickly (fast reads).
If you create an index for *every single word* in the book, the index section will be three times thicker than the book itself (storage space). And if the author changes one sentence on page 5 (an update), the publisher has to completely rewrite the massive index section at the back to fix all the page references (slow writes).

### Key Points
- Indexes slow down data modification operations (INSERT, UPDATE, DELETE).
- They consume significant physical disk space.
- Only create indexes on columns that are heavily queried.
