---
id: databases-030
topic: Databases
difficulty: Junior
format: Open Answer
time: 4
frequency: 95%
source: Custom
prerequisites: ["Database Design"]
tags: [spring-core, system-design, databases, stream-api, collections]
---

# What is Database Normalization?
Explain the concept of Database Normalization and its primary goals.

---ANSWER---

Database Normalization is the process of structuring a relational database in a way that reduces data redundancy and improves data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them.

**Primary Goals:**
1.  **Eliminate Redundant Data:** Prevent storing the same data in multiple places. (e.g., Don't store a customer's address on every single order they place. Store it once in a Customer table).
2.  **Ensure Data Dependencies Make Sense:** Ensure that data is logically stored. (e.g., A product's price belongs in the Products table, not the Orders table).
3.  **Prevent Anomalies:** Protect the database from insert, update, and delete anomalies.
    - *Update Anomaly:* If a customer's address is stored in 10 different orders, you have to update all 10 records if they move. If you miss one, the data is inconsistent.
    - *Delete Anomaly:* If you delete a student's only course enrollment, and their personal info is only stored in the enrollment table, you lose the student's information entirely.

Normalization is achieved by applying a series of rules called Normal Forms (1NF, 2NF, 3NF).

### Life Analogy
Imagine organizing a messy closet.
Instead of having a giant pile of mixed clothes (unnormalized), you organize them. You put all shirts in one drawer, pants in another, and shoes on a rack. You create a system. Normalization is organizing your data into specific, dedicated "drawers" (tables) so you know exactly where to find something, and you aren't storing the same shirt in three different places.

### Key Points
- Normalization structures data to reduce redundancy and improve integrity.
- It prevents update, insert, and delete anomalies.
- It involves breaking large tables into smaller, related ones.
