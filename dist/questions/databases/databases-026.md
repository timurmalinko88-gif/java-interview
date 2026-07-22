---
id: databases-026
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 85%
source: Custom
prerequisites: ["Transactions", "ACID"]
tags: ['databases']
---

# What is a Dirty Read?
Define a Dirty Read in the context of database transactions.

---ANSWER---

A Dirty Read occurs when a transaction reads data that has been modified by another concurrent transaction, but that other transaction has not yet committed its changes.

If the transaction that modified the data subsequently rolls back (fails or is cancelled), the first transaction will have read data that never officially existed in the database. This breaks data consistency.

Dirty reads can only happen if the database isolation level is set to `READ UNCOMMITTED`. Setting the isolation level to `READ COMMITTED` or higher prevents dirty reads.

### Life Analogy
Imagine you are looking over the shoulder of an accountant. They pencil in a $1000 bonus for you on a spreadsheet (Dirty Read). You immediately go and buy a new TV based on that information. However, the accountant realizes they made a mistake and erases the bonus before saving the file (Rollback). You just bought a TV with money you don't have.

### Key Points
- Reading uncommitted data from another transaction.
- Dangerous if the other transaction rolls back.
- Prevented by `READ COMMITTED` isolation level.
