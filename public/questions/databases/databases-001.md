---
id: databases-001
topic: Databases
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["SQL", "Relational Databases"]
tags: ['databases']
---

# What are the ACID properties in a database?
Explain the concept of ACID properties in the context of relational database transactions and provide a brief description of each property.

---ANSWER---

ACID is an acronym that represents the four fundamental properties of a reliable database transaction system. These properties ensure that database transactions are processed reliably and that the database remains in a consistent state, even in the event of hardware failures, software bugs, or network issues.

1.  **Atomicity (All or Nothing):** A transaction is treated as a single, indivisible unit of work. Either all operations within the transaction are successfully completed and committed, or none of them are. If any part of the transaction fails, the entire transaction is rolled back, leaving the database unchanged.
2.  **Consistency (Validity):** A transaction must take the database from one valid state to another valid state. This means that the transaction must adhere to all defined rules, constraints, cascades, and triggers. If a transaction attempts to write invalid data, it will be rejected, preserving data integrity.
3.  **Isolation (Concurrency Control):** When multiple transactions are executing concurrently, their intermediate states should not be visible to each other. Each transaction should execute as if it were the only transaction running on the system, preventing issues like dirty reads, non-repeatable reads, and phantom reads.
4.  **Durability (Permanence):** Once a transaction has been successfully committed, its changes are permanently recorded in the database, even if a system crash or power failure occurs immediately afterward. This typically involves writing changes to persistent storage (e.g., a hard drive or SSD) before acknowledging the commit.

### Life Analogy
Imagine transferring $100 from your checking account to your savings account.
- **Atomicity:** Both the withdrawal and the deposit must happen. If the withdrawal succeeds but the deposit fails (or vice versa), the bank rolls everything back so you don't lose money.
- **Consistency:** The total amount of money between the two accounts should remain the same before and after the transfer. The transaction can't create or destroy money out of thin air.
- **Isolation:** If someone checks your balance right in the middle of the transfer, they shouldn't see an intermediate state where the money has left checking but hasn't arrived in savings yet.
- **Durability:** Once the bank confirms the transfer is complete, it's permanent. Even if the bank's power goes out a second later, the money is safely in your savings account when the systems come back up.

### Key Points
- ACID stands for Atomicity, Consistency, Isolation, and Durability.
- These properties guarantee reliable processing of database transactions.
- Essential for maintaining data integrity in relational database systems.
