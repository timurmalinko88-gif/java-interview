---
id: databases-013
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 65%
source: Custom
prerequisites: ["Database Design", "1NF"]
tags: [spring-core, oop, stream-api, system-design]
---

# Explain Second Normal Form (2NF).
What are the rules for a database table to be in Second Normal Form (2NF)?

---ANSWER---

Second Normal Form (2NF) builds upon the rules of First Normal Form to further reduce data redundancy.

For a table to be in 2NF, it must satisfy two conditions:
1.  **It must be in 1NF.**
2.  **No Partial Dependencies:** All non-key attributes must be fully functionally dependent on the *entire* primary key.

This rule is primarily concerned with tables that have a **Composite Primary Key** (a primary key made up of two or more columns).

- **Partial Dependency:** This occurs when a non-primary-key column depends on only *part* of the composite primary key, rather than the whole key.
- **How to fix it:** If an attribute only depends on part of the composite key, you must remove it from that table and create a new table where that part of the key becomes the full primary key.

*Example:*
Imagine a table: `OrderDetails(OrderID (PK), ProductID (PK), Quantity, ProductName)`
- The Primary Key is (OrderID, ProductID).
- `Quantity` depends on BOTH (you need to know the order and the product to know the quantity).
- `ProductName` depends ONLY on `ProductID`. This is a partial dependency.
- To achieve 2NF, we move `ProductName` to a separate `Products` table.

### Life Analogy
Imagine a student registration form. The unique identifier (PK) is a combination of (StudentID, ClassID).
You also record "StudentName" on this form.
"StudentName" only depends on "StudentID", not on the "ClassID". By writing the student's name on every class registration form, you are repeating data unnecessarily. 2NF says: put the StudentName in a separate "Student" filing cabinet where StudentID is the sole identifier.

### Key Points
- 2NF requires the table to be in 1NF.
- 2NF eliminates partial dependencies.
- It only applies to tables with composite primary keys.
