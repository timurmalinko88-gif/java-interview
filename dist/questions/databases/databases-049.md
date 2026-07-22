---
id: databases-049
topic: Databases
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Databases"]
tags: ['databases']
---

# SQL vs. NoSQL Databases.
What are the main differences between SQL (Relational) and NoSQL (Non-Relational) databases?

---ANSWER---

SQL and NoSQL databases represent two different approaches to data storage, each suited for different use cases.

1.  **Structure:**
    - **SQL:** Table-based (rows and columns). Uses a rigid, predefined schema. Data must fit the schema perfectly. (e.g., MySQL, PostgreSQL, Oracle).
    - **NoSQL:** Document, key-value, graph, or wide-column stores. Has a dynamic or flexible schema. You can insert JSON-like documents with varying structures into the same collection. (e.g., MongoDB, Redis, Cassandra).

2.  **Relationships:**
    - **SQL:** Excellent for complex relationships. Uses Foreign Keys and robust `JOIN` operations to connect data across tables.
    - **NoSQL:** Generally poor at complex joins. Data is often denormalized (nested) within a single document to avoid joins entirely.

3.  **Scaling:**
    - **SQL:** Typically scales **Vertically** (scaling up). To handle more load, you buy a bigger, more expensive server (more RAM, CPU).
    - **NoSQL:** Designed to scale **Horizontally** (scaling out). To handle more load, you add more cheap commodity servers to the cluster, distributing the data.

4.  **ACID Properties:**
    - **SQL:** Provides strict ACID guarantees (Atomicity, Consistency, Isolation, Durability). Essential for financial transactions.
    - **NoSQL:** Often sacrifices strict consistency for high availability and partition tolerance (CAP Theorem). They often use "Eventual Consistency".

### Life Analogy
- **SQL (Relational):** Like an Excel spreadsheet. Every column has a strict header. If you want to add a person's "Favorite Color", you have to add a new column for *everyone*, even if most people leave it blank.
- **NoSQL (Document):** Like a folder full of Word documents. One document can describe a person with just a name and age. The next document can describe a person with a name, age, favorite color, and a list of 10 hobbies. They don't have to follow the exact same template.

### Key Points
- SQL is table-based, strict schema, scales vertically, strong ACID, good for relations.
- NoSQL is document/key-value, dynamic schema, scales horizontally, eventual consistency, good for unstructured data.
