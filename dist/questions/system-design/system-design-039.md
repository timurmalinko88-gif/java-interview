---
id: system-design-039
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 60%
source: Custom
prerequisites: ["Databases"]
tags: ['system-design']
---

# Write-Ahead Logging (WAL)

Relational databases promise Durability (the 'D' in ACID). If the power cord is pulled on a database server the exact millisecond after a transaction is committed, how does the database guarantee the data is not lost? Explain Write-Ahead Logging (WAL).

---ANSWER---

**The Performance Problem:**
Updating a B-Tree index and writing data rows to physical database files on a hard drive involves random I/O. Random disk writes are incredibly slow. If a database had to physically write every committed transaction directly to the data files before returning a "Success" to the user, performance would be abysmal.

**Write-Ahead Logging (WAL):**
To solve this, databases (like PostgreSQL, MySQL/InnoDB, and even NoSQL like Cassandra) use a Write-Ahead Log.

1. **Sequential Write**: The WAL is an append-only file. Appending data to the end of a file (Sequential I/O) is incredibly fast, even on spinning hard drives.
2. **The Process**: When you commit a transaction, the database does *not* write it to the main data files. Instead, it quickly appends a record of the change to the WAL on disk. Once the WAL write is secure on disk, the database tells the client "Transaction Successful."
3. **In Memory**: The actual data changes are kept in RAM (Buffer Pool).
4. **Checkpointing**: Periodically, in the background, a process takes the changes from RAM and slowly flushes them to the actual data files (random I/O) in a batched, efficient manner.
5. **Crash Recovery**: If the server crashes, the data in RAM is lost. But upon reboot, the database reads the WAL. It replays all the logged changes that hadn't yet been written to the data files, fully recovering the lost state.

### Life Analogy
Imagine taking notes during a fast-paced lecture.
WAL: You scribble everything down chronologically in a messy notepad as fast as you can (Sequential Write). You know the information is safe.
Buffer Pool: Later that night, at your own pace, you carefully copy the notes from the notepad into nicely organized binders by subject (Data Files / Checkpointing). If your computer crashes before you finish, you still have the notepad to recover the data.

### Key Points
- Random disk writes are too slow for real-time transactions.
- WAL uses fast, append-only sequential writes to secure data on disk before confirming success.
- Changes are held in RAM and synced to data files later.
- If a crash occurs, the database replays the WAL to recover lost data.
