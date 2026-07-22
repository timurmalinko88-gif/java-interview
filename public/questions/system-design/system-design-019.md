---
id: system-design-019
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 60%
source: Custom
prerequisites: ["Distributed Systems", "Consensus Algorithms"]
tags: ['system-design']
---

# Leader Election in Distributed Systems

Why is Leader Election necessary in some distributed systems? Name a few algorithms or tools used to achieve it, and explain the "Split-Brain" problem.

---ANSWER---

In a distributed system consisting of a cluster of identical nodes, certain tasks should only be performed by exactly one node to prevent data corruption or duplicate work (e.g., writing to a specific shard, running a nightly cron job, or acting as the single source of truth for replication).

**Leader Election** is the process where nodes in a cluster coordinate to select one node as the "Leader" (or Master). All other nodes become "Followers."

**Tools and Algorithms:**
- **Zookeeper / etcd**: Often used to manage leader election using distributed locking.
- **Raft / Paxos**: Consensus algorithms built into databases (like Cassandra, MongoDB, or Kafka) to elect a leader.

**The Split-Brain Problem:**
Suppose a cluster of 4 nodes gets partitioned by a network failure into two halves (2 nodes each). If they can't communicate, *both* halves might assume the other half is dead and elect a new leader. Now you have two leaders (a "Split-Brain"), leading to conflicting writes and data corruption.

*Solution*: **Quorums**. A node can only become a leader if it receives votes from a strict *majority* of the nodes in the cluster (e.g., `(N/2) + 1`).
- In a 5-node cluster, a quorum is 3. If a partition occurs (3 nodes on one side, 2 on the other), only the side with 3 nodes can elect a leader. The side with 2 nodes halts operations because it lacks a quorum, preventing split-brain.

### Life Analogy
Imagine a classroom without a teacher. If everyone tries to talk at once, it's chaos. The students vote for a class president (Leader). If the classroom is divided by a soundproof wall (partition), they must require that a president gets more than half the votes of the *entire* class to be recognized, ensuring there aren't two presidents at once.

### Key Points
- Ensures exactly one node performs critical coordination/write tasks.
- Split-Brain occurs when network partitions cause multiple leaders to be elected.
- Solved by requiring a majority Quorum (`N/2 + 1`) for elections.
