---
id: kafka-004
path: questions/messaging/kafka-004.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Idempotent Producer & Exactly-Once Semantics
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Idempotent Producer & Exactly-Once Semantics in Kafka

Message delivery in distributed systems typically falls into three categories of guarantees:
1.  **At-most-once:** Messages may be lost, but are never redelivered.
2.  **At-least-once:** Messages are never lost, but may be redelivered (duplicates).
3.  **Exactly-once (EOS):** Messages are never lost and are processed exactly one time.

Achieving Exactly-Once Semantics (EOS) in Apache Kafka requires careful configuration of both the producer and the consumer/processing framework. A fundamental building block of EOS is the **Idempotent Producer**.

## The Problem: Duplicate Messages

By default, a Kafka producer operates with at-least-once semantics (assuming `acks=all`). If a producer sends a message to the broker, and the broker successfully commits it but the network connection drops before the broker can send the acknowledgment (ACK) back to the producer, the producer will assume the request failed. 

To prevent data loss, the producer will retry sending the message. The broker, unaware that this is a retry, will append the message a second time. This results in duplicate messages in the Kafka partition.

## The Solution: Idempotent Producer

To solve the duplication problem, Kafka introduced the Idempotent Producer (available since version 0.11). When idempotence is enabled, the producer guarantees that retrying a message will not result in duplicates at the broker level.

### How it works under the hood:

1.  **Producer ID (PID):** When an idempotent producer starts, the Kafka broker assigns it a unique Producer ID.
2.  **Sequence Numbers:** Every message the producer sends is assigned a monotonically increasing sequence number (per partition).
3.  **Broker Deduplication:** The broker maintains the mapping of `[Producer ID, Partition] -> Last Sequence Number`.
4.  **Rejection:** If the broker receives a message with a sequence number it has already seen (or a lower one), it knows this is a duplicate retry. It acknowledges the message back to the producer (so the producer stops retrying) but *does not* append it to the log again.

### Enabling Idempotence

Since Kafka 3.0, the idempotent producer is **enabled by default**. In older versions, or to be explicit, you configure it via properties:

```java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
// Enable idempotence
props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true"); 

// Note: Enabling idempotence automatically enforces the following configs:
// acks = all
// max.in.flight.requests.per.connection <= 5
// retries > 0

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
```

## Exactly-Once Semantics (EOS) and Transactions

While the idempotent producer prevents duplicates from a single producer session, it is not enough for true Exactly-Once Semantics (EOS) across a complex pipeline, especially "consume-process-produce" workloads common in stream processing (like Kafka Streams).

If your application reads a message from Topic A, updates a database, and writes a result to Topic B, and then crashes before committing the offset for Topic A, restarting the application will cause it to re-read from Topic A, potentially updating the DB and writing to Topic B again.

Kafka Transactions solve this by allowing you to update multiple topic partitions (and commit consumer offsets) atomically.

### Kafka Transactions

Transactions ensure that messages sent to multiple partitions, along with the consumer offsets for the consumed messages, are committed as a single unit. Either all writes succeed, or none are visible to consumers.

**Key Components:**
*   **Transaction Coordinator:** A broker module managing transaction state.
*   **Transactional ID:** A static ID assigned to the producer, ensuring that if the producer instance crashes and restarts, the coordinator recognizes it and can abort any pending transactions from the previous zombie instance.

**Code Example (Transactional Producer):**

```java
Properties props = new Properties();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");
// Crucial: Must provide a unique, persistent ID for transactions
props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "order-processor-instance-1");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);

// 1. Initialize transactions (contacts the coordinator)
producer.initTransactions();

try {
    // 2. Start a transaction
    producer.beginTransaction();

    // 3. Send messages to various topics
    producer.send(new ProducerRecord<>("topic-A", "key", "value1"));
    producer.send(new ProducerRecord<>("topic-B", "key", "value2"));

    // 4. Send consumer offsets within the transaction!
    // This links the consumption and production into one atomic unit.
    producer.sendOffsetsToTransaction(currentOffsets, consumerGroupId);

    // 5. Commit the transaction
    producer.commitTransaction();

} catch (ProducerFencedException | OutOfOrderSequenceException | AuthorizationException e) {
    // We can't recover from these exceptions, so our only option is to close the producer and exit.
    producer.close();
} catch (KafkaException e) {
    // For all other exceptions, just abort the transaction and try again.
    producer.abortTransaction();
}
```

### The Consumer Side: Read Committed

For EOS to work, downstream consumers must only read messages that are part of successfully committed transactions. If a transaction is aborted, those messages exist in the log, but consumers should ignore them.

You configure this on the consumer:

```java
Properties props = new Properties();
props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ConsumerConfig.GROUP_ID_CONFIG, "downstream-app");
// ONLY read committed transactional messages (and non-transactional messages)
props.put(ConsumerConfig.ISOLATION_LEVEL_CONFIG, "read_committed"); 

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
```

**Summary:** The Idempotent Producer is the foundation, preventing duplicates on retries. Kafka Transactions build upon idempotence to provide true Exactly-Once processing across complex topologies by atomically committing messages and offsets.
