---
id: databases-031
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 70%
source: Custom
prerequisites: ["Database Normalization"]
tags: ['databases']
---

# What is Denormalization and when would you use it?
Explain Denormalization. Why would a database designer deliberately violate normalization rules?

---ANSWER---

Denormalization is the process of intentionally introducing redundancy into a database by grouping data together that would normally be separated in a fully normalized schema. It is a strategic decision to trade some write performance and data integrity risks for faster read performance.

**When to use it:**
In highly normalized databases (e.g., 3NF), retrieving a complete piece of information often requires joining many tables. Joins are computationally expensive. 
If an application is heavily read-oriented (like a reporting database or a data warehouse) and queries are slow because they require joining 5-10 tables, a designer might denormalize the schema. They might copy the `CustomerName` directly into the `Orders` table. Now, querying an order and the customer's name requires zero joins, drastically speeding up the read.

**Trade-offs:**
- Reads are faster.
- Writes (Inserts/Updates/Deletes) are slower and more complex because the application must update the redundant data in multiple places to maintain consistency.

### Life Analogy
Normalization is keeping your car manual in the glovebox and your mechanic's number in your phone. Denormalization is writing your mechanic's phone number directly onto the cover of the car manual. It violates the "store data in one place" rule, but if your car breaks down, you can find the number much faster without searching two different places.

### Key Points
- Denormalization intentionally adds redundancy.
- Used to speed up complex read queries by eliminating joins.
- Makes write operations slower and increases the risk of data anomalies.
