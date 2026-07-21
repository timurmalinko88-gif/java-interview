---
id: system-design-025
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 85%
source: Custom
prerequisites: ["Databases", "Scalability"]
tags: [system-design, spring-core, collections]
---

# Data Partitioning vs Replication

Explain the difference between Data Partitioning (Sharding) and Data Replication. Why do most modern distributed systems use both simultaneously?

---ANSWER---

**Data Replication (Copying)**
- *What it is*: Keeping identical copies of the exact same data on multiple servers (e.g., Master-Slave or Peer-to-Peer).
- *Goal*: **Availability and Fault Tolerance**. If one server burns down, another server has a complete copy of the data. It also helps scale *reads* (you can read from any copy).
- *Limitation*: It does not solve the storage limit problem. If your database is 10TB, every replica must have a 10TB hard drive.

**Data Partitioning / Sharding (Splitting)**
- *What it is*: Splitting a large dataset into smaller subsets (shards) and storing each subset on a different server.
- *Goal*: **Scalability and Storage**. If your database grows to 100TB, you can split it across 10 servers holding 10TB each. It also scales *writes*, as write load is distributed across servers.
- *Limitation*: Sharding alone provides no fault tolerance. If Shard 1 (holding A-C) burns down, that specific data is lost forever.

**Using Both (The Standard Approach)**
Modern systems (like Kafka, Cassandra, MongoDB) use both. The data is first partitioned to handle massive scale. Then, *each partition* is replicated multiple times to handle failures.
- Example: Data is split into Shard 1 and Shard 2. Shard 1 is replicated to Nodes A, B, and C. Shard 2 is replicated to Nodes D, E, and F.

### Life Analogy
Imagine writing an encyclopedia.
- **Replication**: Printing 5 copies of the book and putting them in 5 different libraries. If one library burns down, the book survives. But the book is massive.
- **Partitioning**: Splitting the encyclopedia into Volume A-M and Volume N-Z. Now it's easier to carry, but if someone loses Volume A-M, that knowledge is gone.
- **Both**: Splitting into volumes, and then printing 5 copies of *each* volume.

### Key Points
- Replication copies data to survive failures and scale reads.
- Partitioning splits data to overcome storage limits and scale writes.
- Distributed systems combine them to achieve both scale and reliability.
