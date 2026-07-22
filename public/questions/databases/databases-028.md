---
id: databases-028
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 80%
source: Custom
prerequisites: ["Transactions", "ACID"]
tags: ['databases']
---

# What is a Phantom Read?
Define a Phantom Read in the context of database transactions.

---ANSWER---

A Phantom Read occurs when a transaction executes a query to retrieve a set of rows that match a certain condition, and then later re-executes that identical query but gets a different set of rows.

This happens because another concurrent transaction inserted or deleted rows that satisfy the search condition and committed those changes between the two queries. The "phantom" refers to the new rows that suddenly appeared (or disappeared).

Phantom reads are prevented only by the highest isolation level: `SERIALIZABLE` (which typically locks entire ranges of data or tables).

### Life Analogy
You ask an event organizer, "How many people are registered for the VIP section?" They say "10" (Query 1). Meanwhile, 2 new people buy VIP tickets at the front desk (Transaction 2 commits). Five minutes later, you ask the organizer the exact same question. They look at the list and say "12" (Query 2). Those two extra people are the phantoms.

### Key Points
- Re-executing a range query yields a different number of rows.
- Caused by another transaction inserting/deleting rows matching the criteria.
- Prevented only by `SERIALIZABLE` isolation level.
