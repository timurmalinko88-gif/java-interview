---
id: databases-015
topic: Databases
difficulty: Senior
format: Open Answer
time: 6
frequency: 80%
source: Custom
prerequisites: ["Indexes", "Data Structures"]
tags: ['databases']
---

# B-Tree vs. Hash Indexes.
Compare B-Tree indexes and Hash indexes in databases. When would you use one over the other?

---ANSWER---

B-Tree (Balanced Tree) and Hash are the two most common underlying data structures used for database indexes. They have very different performance characteristics.

1.  **B-Tree Indexes (Default in most RDBMS):**
    - **Structure:** Data is stored in a balanced, hierarchical tree structure. The leaves contain the index keys and pointers to the rows, sorted in order.
    - **Operations:** Supports exact match lookups (`=`), range queries (`<, >, BETWEEN`), and sorting (`ORDER BY`).
    - **Performance:** Lookup time is logarithmic (O(log N)). Because data is sorted, range queries are very efficient.
    - **Use Case:** The go-to index for almost all standard relational database columns, especially when you need to query ranges of dates, prices, or alphabetically sort results.

2.  **Hash Indexes:**
    - **Structure:** Uses a hash function to map the index key to a specific bucket that contains a pointer to the data row.
    - **Operations:** ONLY supports exact match lookups (`=`, `IN`). It does *not* support range queries, partial string matching (like `LIKE 'abc%'`), or sorting.
    - **Performance:** Lookup time is generally constant (O(1)) and incredibly fast for exact matches.
    - **Use Case:** Useful only when you are purely looking up specific, distinct values. For example, a Memory storage engine in MySQL, or caching session IDs. In InnoDB (MySQL), you cannot explicitly create Hash indexes, but it creates "Adaptive Hash Indexes" internally in memory for frequently accessed B-Tree pages.

### Life Analogy
- **B-Tree:** Like a traditional phone book sorted alphabetically. You can quickly find "Smith, John" (exact match), but you can also easily find everyone whose last name starts with "S" or everyone between "Smith" and "Taylor" (range queries).
- **Hash:** Like a coat check system with numbered tags. If you hand the clerk tag #42, they instantly go to hook #42 and get your coat (O(1) exact match). But if you ask the clerk to "give me all coats numbered between 40 and 50," they can't do it quickly; the hooks aren't necessarily in order, they'd have to search everything.

### Key Points
- B-Tree indexes store data in sorted order, supporting exact matches, range queries, and sorting.
- Hash indexes use a hash function and support ONLY exact matches (O(1) speed).
- B-Tree is the default and most versatile index type in relational databases.
