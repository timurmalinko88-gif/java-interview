---
id: databases-029
topic: Databases
difficulty: Senior
format: Open Answer
time: 6
frequency: 70%
source: Custom
prerequisites: ["Distributed Systems", "Transactions"]
tags: ['databases']
---

# What is a Two-Phase Commit (2PC)?
Explain the Two-Phase Commit protocol. When is it used?

---ANSWER---

Two-Phase Commit (2PC) is a distributed algorithm used to ensure that a transaction that spans multiple databases (or multiple microservices) commits successfully in all of them, or rolls back in all of them. It maintains atomicity across distributed systems.

It involves a **Coordinator** node and multiple **Participant** nodes.

**Phase 1: Prepare (Voting Phase)**
1. The Coordinator asks all Participants: "Are you ready to commit this transaction?"
2. Each Participant executes the transaction locally up to the point of committing. They write to their local transaction logs and lock necessary resources.
3. If a Participant succeeds, it replies "YES". If it fails, it replies "NO".

**Phase 2: Commit (Decision Phase)**
1. The Coordinator receives all votes.
2. If *all* Participants voted "YES", the Coordinator sends a "COMMIT" command to all Participants. They commit and release locks.
3. If *any* Participant voted "NO" (or timed out), the Coordinator sends a "ROLLBACK" command to all Participants. They rollback and release locks.

**Disadvantages:** It is a blocking protocol. If the Coordinator crashes during Phase 2 after some participants voted "YES", those participants must hold their locks indefinitely until the Coordinator recovers, potentially halting the system.

### Life Analogy
Imagine planning a destination wedding with your partner and both sets of parents (Participants).
- **Phase 1 (Prepare):** You (Coordinator) call everyone: "Can you all definitively commit to going to Hawaii on June 1st? Secure your vacation days, but don't buy tickets yet." Everyone says "Yes".
- **Phase 2 (Commit):** Once you have all the "Yes" votes, you call them back: "Great, the decision is made. Buy your non-refundable tickets now." If even one parent said "No" in Phase 1, you would call everyone in Phase 2 and say "Cancel the plans."

### Key Points
- 2PC ensures atomicity across distributed transactions.
- Involves a Prepare phase (voting) and a Commit phase (action).
- It is a synchronous, blocking protocol prone to performance bottlenecks and single points of failure.
