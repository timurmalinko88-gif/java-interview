---
id: system-design-022
topic: System Design
difficulty: Middle
format: Open Answer
time: 20
frequency: 80%
source: Custom
prerequisites: ["Databases", "Replication"]
---

# Master-Slave vs Peer-to-Peer Replication

Explain the difference between Master-Slave (Leader-Follower) and Peer-to-Peer (Master-Master/Leaderless) database replication. What are the consistency trade-offs?

---ANSWER---

**Master-Slave (Leader-Follower) Replication:**
- *Architecture*: One node is designated as the Master (Leader). All other nodes are Slaves (Followers).
- *Writes*: All `INSERT/UPDATE/DELETE` operations *must* go to the Master. The Master then streams the changes (usually via binlog) to the Slaves.
- *Reads*: Can be routed to the Master or the Slaves (to distribute read load).
- *Pros*: Simple to reason about. No write conflicts.
- *Cons*: The Master is a single point of failure for writes. If the Master dies, a Slave must be promoted (Leader Election). Slaves might serve slightly stale data due to replication lag (Eventual Consistency for reads).

**Peer-to-Peer (Leaderless / Master-Master) Replication:**
- *Architecture*: All nodes are equal. (e.g., Cassandra, DynamoDB).
- *Writes*: A client can write to *any* node. That node then replicates the data to the other nodes.
- *Reads*: A client can read from *any* node.
- *Pros*: Highly available for writes. No single point of failure. Extremely scalable.
- *Cons*: **Write Conflicts**. Since two clients can update the same record on two different nodes simultaneously, the system must resolve conflicts (e.g., using timestamps, vector clocks, or Last-Write-Wins). Consistency is harder to guarantee.

### Life Analogy
Master-Slave is like a classroom: Only the teacher (Master) can write on the chalkboard. Students (Slaves) copy the notes into their notebooks. If you want to know what's written, you can read from any student's notebook. Peer-to-Peer is like a shared Google Doc: Everyone can write at the same time, but sometimes two people type over the same sentence and you have to figure out whose edit to keep (conflict resolution).

### Key Points
- Master-Slave routes all writes to a single node, preventing conflicts but bottlenecking writes.
- Peer-to-Peer allows writes to any node, offering high availability but requiring complex conflict resolution.
