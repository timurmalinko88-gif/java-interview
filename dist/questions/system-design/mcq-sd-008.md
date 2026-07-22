---
id: mcq-sd-008
topic: System Design
difficulty: Middle
format: MCQ
tags: ['system-design']
---
Which statement about relational (SQL) and non-relational (NoSQL) databases is true?

A. SQL databases scale horizontally better compared to NoSQL (e.g., Cassandra)
B. NoSQL databases (Document, Key-Value) usually do not support strict ACID transactions across multiple documents/tables
C. SQL databases are designed for storing unstructured files (images, video)
D. NoSQL databases use a strictly fixed schema

---ANSWER---
**Correct Answer: B**

### Key Points
- Most NoSQL solutions make a trade-off: they sacrifice strict ACID transactions in favor of high availability, low latency, and easy horizontal scaling.
