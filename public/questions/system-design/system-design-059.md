---
id: system-design-059
topic: System Design
difficulty: Middle
format: System Design
time: 10
frequency: 85%
source: Custom
prerequisites: ["Microservices", "Kafka", "Transactions", "Outbox Pattern"]
tags: ['core-middle', 'system-design', 'messaging']
---

# Transactional Outbox Pattern in Distributed Microservices

Explain the Dual-Write problem in microservices. How does the Transactional Outbox Pattern resolve it without requiring slow Two-Phase Commits (2PC)?

---ANSWER---

In microservice architectures, an operation often requires updating a local database AND sending an event to a message broker (e.g. Apache Kafka or RabbitMQ).

### The Dual-Write Problem
```
1. Write to DB  ──> OK
2. Send to Kafka ──> Network Failure! (Event lost, state inconsistent)
-- OR --
1. Send to Kafka ──> OK
2. Write to DB   ──> Constraint violation rollback! (Phantom event sent)
```
Because a database and a message broker cannot share a single ACID transaction without distributed 2PC (which is slow and unsupported by Kafka), dual writes guarantee data inconsistencies under failure.

### The Solution: Transactional Outbox Pattern

Instead of publishing directly to Kafka, the service writes the event to a dedicated `outbox` table in the **same local database transaction** as the business entity:

```sql
BEGIN TRANSACTION;
  INSERT INTO orders (id, customer_id, total) VALUES (101, 42, 99.99);
  INSERT INTO outbox (id, aggregate_type, aggregate_id, payload, created_at)
  VALUES (gen_random_uuid(), 'Order', '101', '{"orderId":101,"total":99.99}', NOW());
COMMIT; -- Atomic! Either both saved or none.
```

### Publishing from the Outbox
Two main approaches are used to move events from the table to Kafka:

1. **Change Data Capture (CDC) via Debezium (Recommended):**
   - Debezium reads the database transaction log (PostgreSQL WAL, MySQL binlog) directly.
   - Extracts rows inserted into `outbox` and publishes them to Kafka with near-zero latency and zero query load on the DB.

2. **Polling Publisher:**
   - A scheduled worker runs `SELECT * FROM outbox WHERE published = false LIMIT 100 FOR UPDATE SKIP LOCKED`.
   - Sends to Kafka, then marks as processed or deletes the rows.

### Consumer Idempotency
Because the Outbox Pattern guarantees **at-least-once** delivery, network retries may duplicate events. The downstream consumer **must be idempotent** (using a unique `event_id` or deduplication table).

### Key Takeaways
- Atomic dual-writes: write business entity + outbox record in the same local DB transaction.
- Read via Debezium (CDC) or polling publisher.
- Downstream consumers must implement idempotency.\n