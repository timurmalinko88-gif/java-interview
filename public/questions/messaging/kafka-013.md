---
id: kafka-013
path: questions/messaging/kafka-013.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Delivery Guarantees configs (At-least-once, etc)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Delivery Guarantees Configs in Kafka

Message delivery guarantees define the contract between the messaging system and the application regarding message loss and duplication. Understanding how to configure Kafka for specific guarantees is essential for building reliable systems.

There are three primary delivery guarantees:

1.  **At-most-once:** Messages may be lost, but are never redelivered (no duplicates).
2.  **At-least-once:** Messages are never lost, but may be redelivered (duplicates possible).
3.  **Exactly-once (EOS):** Messages are never lost and are processed exactly one time.

Achieving these guarantees requires tuning configurations on *both* the Producer and the Consumer.

---

## 1. At-Most-Once (Fire and Forget)

Use this for high-throughput telemetry, metrics, or logging where occasional data loss is acceptable, but low latency is critical.

### Producer Configuration
*   **`acks = 0`**: The producer sends the message and immediately considers it successful without waiting for any acknowledgment from the broker. If the network drops or the broker crashes, the message is lost.
*   **`retries = 0`**: If an error occurs, the producer will not attempt to resend the message.

### Consumer Configuration
*   **`enable.auto.commit = true`**: (Default). The consumer will periodically commit offsets in the background.
*   *Why it can cause At-most-once:* If the consumer fetches a batch of messages, the background thread commits the offsets, and then the application crashes *before* processing those messages, upon restart, the consumer will fetch from the newly committed offset, skipping the unprocessed messages.
*   *(Alternatively: Manual commit `ACK_IMMEDIATE` before processing).*

---

## 2. At-Least-Once (The Standard)

Use this for financial transactions, orders, and most business events. It guarantees no data loss, but your downstream systems **must be idempotent** to handle potential duplicate messages safely.

### Producer Configuration
*   **`acks = all` (or `-1`)**: The producer will wait for acknowledgment not just from the partition leader, but from all In-Sync Replicas (ISRs). This guarantees the message is safely replicated across multiple brokers.
*   **`retries = Integer.MAX_VALUE`**: The producer will retry indefinitely on transient errors (like network blips).
*   **`min.insync.replicas = 2` (Broker/Topic level config):** Ensures that `acks=all` actually implies at least two brokers have the data.

### Consumer Configuration
*   **`enable.auto.commit = false`**: Disable background commits.
*   **Manual Commit AFTER Processing:** You must process the message (e.g., save to DB) and *only then* call `consumer.commitSync()` or `commitAsync()`.
*   *Why it causes At-least-once:* If processing succeeds but the consumer crashes before committing the offset, the replacement consumer will fetch the same message again. Your application logic must handle this duplicate.

---

## 3. Exactly-Once Semantics (EOS)

Use this when you cannot tolerate duplicates and downstream systems cannot be easily made idempotent (e.g., incrementing a counter, or processing streams in Kafka Streams).

### Producer Configuration
*   **`enable.idempotence = true`**: Prevents the producer from introducing duplicates if it retries a send operation. The broker identifies and discards duplicate retries using a Producer ID and sequence numbers.
*   **`transactional.id = "my-app-id"`**: Required for producing to multiple partitions atomically.
*   **(Implied):** Enabling idempotence automatically enforces `acks=all` and `retries > 0`.

### Consumer Configuration
*   **`isolation.level = read_committed`**: This is crucial. By default, consumers read all messages (`read_uncommitted`). By changing this, the consumer will only read messages that are part of successfully committed transactions. It will ignore messages belonging to aborted transactions or open transactions.
*   **Processing Framework:** True EOS in Kafka is typically achieved using the **Kafka Transactions API**, where reading offsets, processing data, and producing new events are wrapped in a single atomic transaction. This is built into **Kafka Streams** (enabled simply by setting `processing.guarantee=exactly_once_v2`).

---

## Summary Matrix

| Guarantee | Producer `acks` | Producer Retries | Consumer Commit Timing | Consumer `isolation.level` |
| :--- | :--- | :--- | :--- | :--- |
| **At-most-once** | `0` | `0` | Auto-commit (or manual before processing) | `read_uncommitted` |
| **At-least-once** | `all` | `> 0` | Manual **AFTER** processing | `read_uncommitted` |
| **Exactly-once** | `all` + Idempotence | `> 0` | Part of a Kafka Transaction | `read_committed` |
