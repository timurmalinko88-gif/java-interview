---
id: system-design-012
topic: System Design
difficulty: Middle
format: Open Answer
time: 20
frequency: 85%
source: Custom
prerequisites: ["Databases"]
tags: ['system-design']
---

# Relational vs NoSQL Databases

Compare Relational (SQL) and NoSQL databases. When would you choose one over the other in a system design context?

---ANSWER---

**Relational Databases (SQL - e.g., PostgreSQL, MySQL)**
- *Structure*: Data is stored in tables with predefined schemas. Relationships are defined via foreign keys.
- *Scaling*: Vertically scalable (scale up by adding more CPU/RAM). Horizontal scaling (sharding) is difficult.
- *Properties*: ACID compliant (Atomicity, Consistency, Isolation, Durability). Ensures strict data integrity.
- *Use case*: Financial systems, inventory management, or anywhere data structure is rigid and transactional integrity is paramount.

**NoSQL Databases (e.g., MongoDB, Cassandra, DynamoDB)**
- *Structure*: Flexible schemas. Data can be stored as Documents (JSON), Key-Value pairs, Wide-columns, or Graphs.
- *Scaling*: Designed to scale horizontally (scale out by adding more cheap commodity servers).
- *Properties*: Usually follows the BASE model (Basically Available, Soft state, Eventual consistency). Sacrifices strict consistency for high availability and partition tolerance.
- *Use case*: Rapid prototyping, handling massive volumes of unstructured or semi-structured data, real-time big data, IoT telemetry.

**When to choose which?**
- Start with **SQL** as the default. It's mature, handles complex queries/joins well, and ensures data integrity.
- Move to **NoSQL** only when you hit the scaling limits of SQL (e.g., millions of writes per second), when your schema is constantly changing and unpredictable, or when you specifically need a document/graph data model.

### Life Analogy
SQL is like a highly organized Excel spreadsheet with locked columns. Everyone must follow the rules, which prevents mistakes but makes it hard to suddenly add a "video" column. NoSQL is like a folder of word documents. You can throw anything in there, it's very flexible, but finding connections between the documents is harder.

### Key Points
- SQL is table-based, schema-rigid, and scales vertically. Excellent for ACID transactions.
- NoSQL is document/key-value based, flexible, and scales horizontally. Excellent for massive throughput and eventual consistency.
