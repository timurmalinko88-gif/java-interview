---
id: system-design-049
topic: System Design
difficulty: Middle
format: Open Answer
time: 20
frequency: 85%
source: Custom
prerequisites: ["Databases", "Distributed Systems"]
tags: ['system-design']
---

# Eventual vs Strong Consistency

Explain the difference between Strong Consistency and Eventual Consistency. Give practical examples of when you would use each.

---ANSWER---

In distributed databases with multiple replicated nodes, updating data introduces a delay between the nodes.

**1. Strong Consistency:**
- *What it is*: After a write is acknowledged as successful, any subsequent read (from *any* node) is guaranteed to return that newly written data.
- *How it's achieved*: The system locks the record across all replicas (or a quorum) during the write. (e.g., Relational Databases, ZooKeeper).
- *Pros*: Data is perfectly accurate. No surprises for the user.
- *Cons*: High latency (writes are slow because they wait for replication) and lower availability (if network partition prevents replication, the system refuses writes).
- *Use cases*: Financial transactions, inventory management, password updates. (You cannot have an eventually consistent bank balance).

**2. Eventual Consistency:**
- *What it is*: If no new updates are made to a given data item, eventually all accesses to that item will return the last updated value. In the short term, a read might return stale data.
- *How it's achieved*: A write is accepted by one node and instantly returns success. The data is replicated to other nodes in the background asynchronously. (e.g., Cassandra, DynamoDB).
- *Pros*: High availability and extremely low latency. The system stays up even if nodes can't talk to each other.
- *Cons*: Developers must handle stale data.
- *Use cases*: Social media likes, view counts, comment sections. If a celebrity posts a photo, it's okay if someone sees 10,000 likes while someone else sees 9,998 likes for a few seconds.

### Life Analogy
Strong Consistency is a joint bank account. If your spouse withdraws $100 in New York, the bank centralizes the lock. If you check the ATM in LA one second later, it accurately shows $100 less.
Eventual Consistency is updating your phone number with your HR department. They accept the change immediately. But if someone asks the IT department for your number 5 minutes later, IT might still give the old number because the HR memo hasn't circulated yet. Eventually, everyone gets the memo.

### Key Points
- Strong Consistency sacrifices performance/availability for perfect data accuracy.
- Eventual Consistency sacrifices immediate accuracy for massive scale and speed.
