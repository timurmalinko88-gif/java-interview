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
How would you implement the Transactional Outbox pattern to reliably publish events to Kafka after a database update, and what are the trade-offs between using Spring's application-level publishing versus a CDC tool like Debezium?

---ANSWER---

The Transactional Outbox pattern is a powerful solution to the "dual write" problem in distributed systems, ensuring that updating a database and publishing an event to a message broker (like Kafka) both happen atomically. If a service attempts to write to the database and then immediately sends a message to Kafka, the application might crash after the database commit but before the Kafka publish, leading to inconsistencies. The outbox pattern avoids this by saving the event to an "outbox" table within the same database transaction as the primary state change.

There are two primary approaches to polling or reading from this outbox table to publish to Kafka: Application-level publishing (e.g., using Spring) and Change Data Capture (CDC) (e.g., using Debezium).

**Spring/Application-Level Polling:**
In this approach, a background thread or a scheduled job within the Spring application periodically polls the outbox table for new, unpublished messages. Once it reads the records, it publishes them to Kafka and marks them as processed (or deletes them) in the outbox table. 
*   **Pros:** It is straightforward to implement, requires no extra infrastructure, and keeps the logic within the application codebase.
*   **Cons:** Polling creates overhead on the database, can introduce latency between the data change and event publication, and can be difficult to scale efficiently in a multi-instance application without running into locking or duplicate publication issues.

**Debezium (Change Data Capture):**
Debezium operates at the database transaction log level (e.g., PostgreSQL's Write-Ahead Log or MySQL's binlog). It tails the log and streams the changes from the outbox table directly into Kafka as events.
*   **Pros:** It provides near real-time event streaming with minimal latency. It completely offloads the database polling overhead because it reads the replication log, not the table itself. It is robust, scalable, and inherently provides "at-least-once" delivery guarantees.
*   **Cons:** It requires additional infrastructure (Kafka Connect and Debezium connectors) to manage and monitor. It also requires the database to have CDC capabilities enabled and proper permissions configured, which can sometimes be complex.

For high-throughput, mission-critical systems, Debezium is almost always preferred due to its efficiency and reliability. Spring polling is often sufficient for simpler applications or where minimizing infrastructure complexity is prioritized over minimal latency.

### Examples
```java
// Spring/Hibernate Outbox Entity
@Entity
@Table(name = "outbox_events")
public class OutboxEvent {
    @Id
    @GeneratedValue
    private UUID id;
    
    private String aggregateType;
    private String aggregateId;
    private String payload; // JSON of the event
    
    @Column(nullable = false)
    private boolean processed = false;
    
    // Getters, setters, etc.
}

// Transactional service method
@Transactional
public void createOrder(Order order) {
    orderRepository.save(order);
    
    OutboxEvent event = new OutboxEvent();
    event.setAggregateType("Order");
    event.setAggregateId(order.getId().toString());
    event.setPayload(objectMapper.writeValueAsString(order));
    outboxRepository.save(event);
}
```

### Life Analogy
Imagine writing a letter and needing to mail it. The "dual write" problem is like trying to drop the letter in a mailbox while simultaneously updating your personal diary that you sent it. If you get distracted after updating the diary, the letter might never get mailed. 

The Outbox pattern is like having a designated "Outbox" tray on your desk. When you update your diary (database), you also place the letter in the tray (outbox table) at exactly the same time. 

Using Spring polling is like checking your tray every 5 minutes and walking the letters to the mailbox yourself. Using Debezium is like hiring a dedicated assistant whose only job is to watch the tray and immediately take any new letters to the post office as soon as they appear.

### Key Points
- Solves the dual-write problem by writing data and events in a single database transaction.
- Avoids data inconsistency if the application crashes after the DB commit but before publishing.
- Application polling is simpler but creates DB load and latency.
- CDC (Debezium) reads the database transaction log, offering low latency and decoupling without polling overhead.
