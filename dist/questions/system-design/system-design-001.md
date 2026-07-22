---
id: system-design-001
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 80%
source: Custom
prerequisites: ["Distributed Systems"]
tags: ['system-design']
---

# Explain the CAP Theorem and its implications

What is the CAP Theorem? Can a distributed system guarantee all three properties simultaneously? Explain why or why not, and give examples of systems that favor CP vs AP.

---ANSWER---

The CAP Theorem (Brewer's Theorem) states that a distributed data store can only simultaneously provide two of the following three guarantees:
1. **Consistency (C)**: Every read receives the most recent write or an error.
2. **Availability (A)**: Every request receives a (non-error) response, without the guarantee that it contains the most recent write.
3. **Partition Tolerance (P)**: The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes.

In a distributed system, network partitions (P) are inevitable. Therefore, when a partition occurs, the system must choose between Consistency (CP) and Availability (AP).
- **CP Systems** (e.g., HBase, MongoDB, Redis in some configs): Wait for a response from the partitioned node to ensure consistency, which may result in a timeout/error (sacrificing availability).
- **AP Systems** (e.g., Cassandra, DynamoDB): Return the most recent available version of the data, which might be stale (sacrificing consistency for availability).

### Life Analogy
Imagine a business with two clerks managing a ledger in different rooms (Partition Tolerance). If the phone line between them breaks, and a customer asks Clerk A for a balance, Clerk A can either refuse to answer until the phone works (Consistency) or give the last known balance (Availability). They can't do both.

### Key Points
- You cannot avoid network partitions in distributed systems.
- Must choose between Consistency (CP) and Availability (AP) during a partition.
- Relational databases typically favor consistency (ACID), while NoSQL databases often favor availability (BASE).
