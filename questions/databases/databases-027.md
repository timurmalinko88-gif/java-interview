---
id: databases-027
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 80%
source: Custom
prerequisites: ["Transactions", "ACID"]
---

# What is a Non-Repeatable Read?
Define a Non-Repeatable Read in the context of database transactions.

---ANSWER---

A Non-Repeatable Read occurs when a single transaction reads the same specific row of data twice, but gets two different results.

This happens because between the first read and the second read, another concurrent transaction modified that exact row and successfully committed the changes.

Non-repeatable reads can occur in `READ UNCOMMITTED` and `READ COMMITTED` isolation levels. They are prevented by setting the isolation level to `REPEATABLE READ` or higher (which typically places read locks on the rows).

### Life Analogy
You check a website and see a shirt is $20. You leave the tab open (Transaction 1 starts). Meanwhile, the store manager updates the database to change the price to $30 (Transaction 2 commits). You hit refresh on your tab to look at the same shirt again, and it now says $30. You read the same item twice in your session and got two different prices.

### Key Points
- Reading the same row twice in one transaction yields different results.
- Caused by another transaction modifying and committing the row in between reads.
- Prevented by `REPEATABLE READ` isolation level.
