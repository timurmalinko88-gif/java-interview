---
id: kafka-001
path: questions/messaging/kafka-001.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Transactional Outbox Pattern (Debezium vs Spring)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Transactional Outbox Pattern (Debezium vs Spring)

The Transactional Outbox pattern is a critical architectural pattern used in microservices to ensure that a database update and a message publication to a broker (like Apache Kafka) occur in a single atomic transaction. Without this pattern, you risk the "dual write" problem: if the database commits but the application crashes before publishing the message, the system is left in an inconsistent state. Conversely, if you publish the message first and the database transaction fails, downstream services process an event that never actually happened in the source database.

## How the Outbox Pattern Works

Instead of directly publishing a message to Kafka after updating a business entity, the service updates the entity and inserts a corresponding event record into a dedicated `outbox` table within the same database transaction. Since both operations target the same relational database (or document store supporting multi-document transactions), they succeed or fail together. An independent process (the "message relay") then polls or tails this `outbox` table and publishes the messages to Kafka. Once published, the message is marked as processed or deleted from the `outbox` table.

## Implementation: Spring (Polling) vs Debezium (CDC)

There are two primary ways to implement the message relay: Polling (often implemented with Spring) and Change Data Capture (CDC, typically implemented with Debezium).

### 1. Polling the Outbox Table (Spring/JPA)

In a Spring-based approach, you might run a scheduled job that periodically queries the `outbox` table for unpublished events.

**Pros:**
* Simple to understand and implement within an existing Spring Boot application.
* No additional infrastructure (like Kafka Connect) is required.

**Cons:**
* **Polling Overhead:** Frequent database queries can degrade database performance, especially if the outbox table grows large.
* **Latency:** There is an inherent delay between the database commit and message publication, dictated by the polling interval.
* **Complexity in Scaling:** Ensuring only one instance of the scheduled job processes a specific outbox record (to avoid duplicate publishing) requires distributed locks (e.g., using ShedLock or database-level locking).

**Code Example (Spring Polling):**

```java
@Service
public class OutboxRelayService {

    @Autowired
    private OutboxRepository outboxRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Scheduled(fixedDelay = 5000) // Poll every 5 seconds
    @Transactional
    public void processOutbox() {
        List<OutboxEvent> events = outboxRepository.findByProcessedFalse();
        for (OutboxEvent event : events) {
            // Publish to Kafka
            kafkaTemplate.send(event.getTopic(), event.getPayload());
            // Mark as processed (or delete)
            event.setProcessed(true);
            outboxRepository.save(event);
        }
    }
}
```

### 2. Change Data Capture (Debezium)

Debezium is an open-source distributed platform for CDC. It acts as a Kafka Connect source connector. Instead of querying the database, Debezium tails the database's transaction log (e.g., the `binlog` in MySQL, or `WAL` in PostgreSQL). When an insert is committed to the `outbox` table, Debezium immediately detects it from the transaction log and publishes it to Kafka.

**Pros:**
* **Near Real-time:** Messages are published to Kafka almost instantaneously after the database transaction commits.
* **Low Database Impact:** Tailing the transaction log is highly efficient and avoids the overhead of continuous `SELECT` queries.
* **Robust & Scalable:** Debezium handles failures gracefully, resuming from the last read position in the transaction log, guaranteeing at-least-once delivery without distributed locking complexity in application code.

**Cons:**
* **Infrastructure Complexity:** Requires setting up and managing Kafka Connect and Debezium.
* **Database Configuration:** Requires specific database configurations (e.g., enabling logical replication in PostgreSQL).

**Debezium Connector Configuration (Example for PostgreSQL):**

```json
{
  "name": "outbox-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname" : "order_db",
    "database.server.name": "dbserver1",
    "table.include.list": "public.outbox_events",
    "plugin.name": "pgoutput",
    "transforms": "outbox",
    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
    "transforms.outbox.route.topic.replacement": "${routedByValue}"
  }
}
```

## Summary Comparison

| Feature | Polling (Spring) | CDC (Debezium) |
| :--- | :--- | :--- |
| **Latency** | Higher (depends on poll interval) | Very Low (near real-time) |
| **Database Load** | High (continuous queries) | Low (tails transaction log) |
| **Infrastructure** | Simple (app-level scheduling) | Complex (Kafka Connect cluster) |
| **Best For** | Low throughput, simple stacks | High throughput, strict consistency |

While polling is easier to start with, Debezium is the industry standard for the Outbox pattern in high-throughput, mission-critical microservice architectures due to its efficiency and reliability.
