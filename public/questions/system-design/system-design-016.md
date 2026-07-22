---
id: system-design-016
topic: System Design
difficulty: Senior
format: Open Answer
time: 25
frequency: 75%
source: Custom
prerequisites: ["Microservices", "Databases"]
tags: [spring-core, system-design, patterns, databases, memory, multithreading, collections]
---

# Two-Phase Commit (2PC) vs Saga Pattern

In a distributed system, how do you handle a transaction that spans multiple services (e.g., booking a flight and a hotel simultaneously)? Compare the Two-Phase Commit (2PC) protocol with the Saga pattern.

---ANSWER---

Distributed transactions are notoriously difficult because standard ACID database transactions cannot span across different microservices.

**1. Two-Phase Commit (2PC):**
A centralized coordinator manages the transaction across all participating services.
- *Phase 1 (Prepare)*: Coordinator asks all services, "Are you ready to commit?" Services lock their resources and reply Yes/No.
- *Phase 2 (Commit/Rollback)*: If *all* say Yes, the coordinator tells them to commit. If *any* say No, it tells them all to rollback.
- *Pros*: Provides strong consistency.
- *Cons*: Highly synchronous and slow. If the coordinator or any service crashes during Phase 2, locks are held indefinitely, grinding the system to a halt. Not scalable for modern microservices.

**2. Saga Pattern:**
A sequence of local transactions where each step updates a local database and publishes an event to trigger the next step.
- *Choreography*: Services listen to each other's events directly (No central coordinator).
- *Orchestration*: A central Saga Orchestrator tells services what to do next based on the state.
- *Compensation*: If a step fails (e.g., Flight booked, but Hotel failed), the Saga executes **Compensating Transactions** (e.g., Cancel the Flight) to undo the previous steps.
- *Pros*: Asynchronous, highly scalable, no long-lived database locks.
- *Cons*: Provides Eventual Consistency, not Strong Consistency. Complex to implement and debug (compensating transactions must be idempotent).

### Life Analogy
2PC is like a wedding: The officiant (coordinator) asks the bride and groom if they take each other. Only when both say "I do" (prepare) does the marriage happen (commit). Saga is like booking a vacation: You book the flight (step 1), then try the hotel (step 2). If the hotel is full, you don't magically rollback time; you must explicitly call the airline to cancel the flight (compensating transaction).

### Key Points
- 2PC is synchronous, uses locking, and provides strong consistency (but scales poorly).
- Saga is asynchronous, uses events, relies on compensating transactions to rollback, and provides eventual consistency (scales well).
