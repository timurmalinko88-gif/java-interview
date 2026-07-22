---
id: multithreading-005
topic: Multithreading
difficulty: Senior
format: System Design
estimated_time_minutes: 25
frequency: Medium
related_questions: [How Outbox / Saga patterns work, Database Deadlocks]
source: Custom
prerequisites: [Distributed transactions, Database locks, Message queues]
tags: [spring-core, system-design, patterns, databases, memory, multithreading, collections]
---

Design a Distributed Task Scheduler for a microservice architecture. The system must execute millions of delayed tasks (for example, send a push notification exactly 24 hours after an event).

We have a cluster of 10 identical instances of our service (nodes) working with a single relational database (PostgreSQL) or a broker (RabbitMQ/Kafka).

**Requirements:**

* A task must not be executed simultaneously by two nodes (duplicate prevention).
* If a node picks up a task and crashes (OOM/Crash), the task should not hang forever; it must be picked up by another node.
* Describe the trade-offs of your chosen solution.

---ANSWER---

In distributed systems, relying on in-memory timers (like `ScheduledExecutorService`) is not possible, since the state is lost upon node restart. An external coordinator is needed — a Database or a Message Broker.

### Database Polling with Locks (Relational DB)

Table `tasks (id, payload, execution_time, status, locked_by, locked_at)`.

* Every N seconds, each node queries the database to find tasks where `execution_time <= NOW()` and `status = 'PENDING'`.
* To avoid a single task being captured by different nodes, we use **Row-level Locks** with the `SKIP LOCKED` directive:

```java
UPDATE tasks
SET status = 'PROCESSING', locked_by = 'node_id', locked_at = NOW()
WHERE id IN (
    SELECT id FROM tasks
    WHERE execution_time <= NOW() AND status = 'PENDING'
    LIMIT 10
    FOR UPDATE SKIP LOCKED
)
RETURNING *;
```

* Execute the business logic (sending the push notification).
* Update the status: `status = 'COMPLETED'`.
* **Handling crashes:** A background job searches for tasks with the `PROCESSING` status where `locked_at` is older than a reasonable timeout (e.g., 5 minutes). Their status is reset back to `PENDING`, and another node will pick them up during the next poll.

### Broker with Delayed Routing (RabbitMQ + Delayed Message Plugin)

When creating a task, we send a message to RabbitMQ with a TTL = 24 hours (or use the `x-delayed-message` plugin).

* The message hangs in the exchange for 24 hours, after which it drops into a working queue.
* Nodes are connected to the queue as Consumers. RabbitMQ automatically balances messages among the 10 nodes (concurrent consumers). Duplicate prevention is available out of the box.
* **Handling crashes:** We use manual acknowledgment (`manual ack`). The message is deleted from RabbitMQ only after successfully sending the push notification. If a node crashes, the connection drops, and the broker automatically returns the message to the queue, assigning it to another node.

### Trade-offs

* **DB Polling** — Simpler to implement, no new infrastructure dependencies, easy to monitor. *Cons:* database load from frequent polling, execution delays depend on the polling interval (there could be a drift of several seconds).
* **RabbitMQ** — Millisecond-accurate execution, zero load on the DB, built-in balancing and `ack`. *Cons:* harder to cancel or modify a scheduled task (finding a message inside a broker is almost impossible; invalidation logic must be implemented on the consumer side), requires a plugin.

### Idempotency (Protection against duplicates)

Both options provide *at-least-once* delivery. If a node sent a push but crashed before recording the status/ack, the task will be repeated. The push notification sending method must be idempotent (e.g., a unique `Idempotency-Key` based on the `task_id` is passed to the external API).

* When using a DB, the `SELECT ... FOR UPDATE SKIP LOCKED` pattern is critical for concurrent fetching without deadlocks.
* Handling failures ("zombie tasks") is resolved through lock timeouts (`locked_at`) in the DB or acknowledgment mechanisms (`ack` / `nack`) in message queues.
* Idempotency on the executor side is mandatory, as distributed systems guarantee at-least-once delivery.

### Life Analogy

A Database with polling is a notice board. 10 workers constantly run up to the board. `SKIP LOCKED` is when a worker tears off a sticker with a task so another doesn't take it. If the worker disappears for an hour (the node crashes), the foreman (background job) notices this, prints a duplicate sticker, and hangs it back on the board.

### Key Points
* Local schedulers do not work in a cluster. An external state store is required.
