---
id: system-design-023
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 80%
source: Custom
prerequisites: ["Databases", "Data Structures"]
---

# Database Indexes (B-Tree vs Hash)

How does a database index work? Compare B-Tree indexes and Hash indexes. When would you use each?

---ANSWER---

A database index is a specialized data structure that improves the speed of data retrieval operations on a table, at the cost of additional storage space and slower writes (because the index must be updated on every INSERT/UPDATE).

**1. B-Tree (Balanced Tree) Indexes:**
- *How it works*: Stores data in a balanced tree structure where data is sorted. Navigating from the root to the leaf node takes `O(log N)` time.
- *Use cases*: Because the data is sorted, B-Trees are excellent for **range queries** (e.g., `WHERE age > 18 AND age < 30`), **sorting** (`ORDER BY`), and prefix matching (`WHERE name LIKE 'John%'`).
- *Default*: This is the default index type in almost all relational databases (PostgreSQL, MySQL).

**2. Hash Indexes:**
- *How it works*: Applies a hash function to the indexed column and stores a pointer to the row in a hash table. Lookup takes `O(1)` time.
- *Use cases*: Only supports **exact match queries** (e.g., `WHERE user_id = 1234`).
- *Limitations*: Cannot be used for range queries, sorting, or partial matches. If you ask `WHERE age > 18`, a hash index is completely useless.

### Life Analogy
An index is like the index at the back of a textbook. Instead of reading the whole book (Full Table Scan) to find mentions of "Java", you look up "Java" in the index, which gives you the exact page number. A B-Tree is an alphabetical index (good for finding everything between J and L). A Hash index is like a magical search bar that only works if you type the exact word perfectly.

### Key Points
- Indexes speed up reads but slow down writes.
- B-Trees (`O(log N)`) are the default, supporting range queries and sorting.
- Hash indexes (`O(1)`) are faster but only support exact equality checks.
