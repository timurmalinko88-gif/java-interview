---
id: system-design-017
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 70%
source: Custom
prerequisites: ["Event Sourcing", "Architecture"]
tags: ['system-design']
---

# Event Sourcing

What is Event Sourcing? How does it differ from traditional CRUD state storage? What are the benefits and challenges of this pattern?

---ANSWER---

**Traditional CRUD:**
When you update a user's address, you overwrite the old address in the database with the new one. The database only stores the *current state*. You lose the history of how the state changed unless you explicitly maintain audit logs.

**Event Sourcing:**
Instead of storing just the current state, you store a sequence of state-changing events in an append-only log (the Event Store).
- *Example Events*: `UserCreated`, `AddressUpdated`, `EmailChanged`.
- *Rebuilding State*: To get the current state of an entity, you load all its past events and apply them in sequence.

**Benefits:**
- **Perfect Audit Trail**: You have a complete, mathematically verifiable history of every change.
- **Time Travel**: You can reconstruct the state of the system at any point in time by replaying events up to that timestamp.
- **High Write Performance**: Writing is fast because it's just appending to a log (no complex locking or updates).
- Pairs perfectly with CQRS (Command Query Responsibility Segregation).

**Challenges:**
- **Complexity**: Much harder to implement and reason about than CRUD.
- **Performance**: Replaying 10,000 events just to load a user's profile is slow. *Solution: Use "Snapshots" (save the state every 100 events).*
- **Event Schema Evolution**: If the structure of an event changes over the years, your code must handle parsing all old versions.

### Life Analogy
Traditional CRUD is like a whiteboard where you erase the old score and write the new one. Event Sourcing is like an accountant's ledger: you never erase anything; you only add new transactions (credits/debits). To find the current balance, you add up all the transactions.

### Key Points
- State is derived by replaying a sequence of append-only events.
- Provides a perfect audit log and "time-travel" debugging.
- Often requires Snapshots to maintain read performance.
