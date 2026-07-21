---
id: databases-016
topic: Databases
difficulty: Senior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Distributed Systems", "Databases"]
---

# Explain the CAP Theorem.
What is the CAP Theorem, and why is it important in distributed database design?

---ANSWER---

The CAP Theorem (Brewer's Theorem) states that it is impossible for a distributed data store to simultaneously provide more than two out of the following three guarantees:

1.  **Consistency (C):** Every read receives the most recent write or an error. All nodes see the same data at the same time.
2.  **Availability (A):** Every request receives a (non-error) response, without the guarantee that it contains the most recent write. The system remains operational.
3.  **Partition Tolerance (P):** The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes.

**Why it matters:**
In any distributed system over a network, network partitions (P) are unavoidable. Therefore, you cannot choose CA. You must choose between **CP (Consistency and Partition Tolerance)** or **AP (Availability and Partition Tolerance)** during a network failure.
- **CP Systems (e.g., MongoDB, HBase):** If a partition occurs, the system will block reads/writes (losing availability) to ensure data doesn't become inconsistent.
- **AP Systems (e.g., Cassandra, DynamoDB):** If a partition occurs, the system continues to accept reads/writes, potentially serving stale data (losing consistency) to ensure the system remains available. They often rely on "Eventual Consistency".

### Life Analogy
Imagine a two-branch bank.
If the phone line (network) between the branches breaks (Partition):
- **CP Choice:** The bank closes its doors until the phone is fixed, ensuring nobody overdraws their account (Consistency), but customers are angry they can't access money (loss of Availability).
- **AP Choice:** Both branches stay open and let people withdraw money based on their local ledger. The bank is highly Available, but someone might withdraw $100 from both branches simultaneously when they only had $100 total (loss of Consistency).

### Key Points
- CAP stands for Consistency, Availability, Partition Tolerance.
- A distributed system can only guarantee two of the three.
- Because network partitions (P) are inevitable, systems must choose between CP and AP.
