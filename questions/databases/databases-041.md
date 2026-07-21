---
id: databases-041
topic: Databases
difficulty: Middle
format: Open Answer
time: 3
frequency: 50%
source: Custom
prerequisites: ["SQL", "Transactions"]
---

# What is a SAVEPOINT in SQL?
Explain what a SAVEPOINT is and how it is used within a database transaction.

---ANSWER---

A `SAVEPOINT` is a marker set within a transaction that allows you to roll back a specific portion of the transaction, rather than rolling back the entire transaction.

Normally, if a transaction hits an error, the `ROLLBACK` command undoes everything since the transaction started.

By setting a savepoint, you can create a "safe state" midway through your work. If something goes wrong later, you can issue `ROLLBACK TO SAVEPOINT savepoint_name`. This will undo only the operations performed *after* the savepoint was created, leaving the operations before the savepoint intact and still uncommitted.

### Life Analogy
Imagine playing a difficult video game level.
- **Normal Transaction:** You start the level. If you die right at the end, you go all the way back to the start of the level and lose all progress.
- **SAVEPOINT:** You reach a checkpoint halfway through the level (Savepoint). If you die near the end, you don't go back to the start; you respawn at the checkpoint, keeping your progress up to that point.

### Key Points
- A marker within a transaction.
- Allows partial rollback of a transaction.
- Syntax: `SAVEPOINT name;` and `ROLLBACK TO SAVEPOINT name;`
