---
id: kafka-006
path: questions/messaging/kafka-006.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Manual Offset Commit Risks (ACK_IMMEDIATE)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture, consumers]
---

# Manual Offset Commit Risks (ACK_IMMEDIATE)
When disabling Kafka's auto-commit, what are the primary risks associated with committing offsets immediately after every message (e.g., Spring's `AckMode.RECORD` or `ACK_IMMEDIATE`), and what are the alternatives?

---ANSWER---

By default, Kafka consumers are configured with `enable.auto.commit=true`. This means a background thread periodically commits the highest offset the consumer has fetched. While convenient, it provides weak delivery guarantees because if the consumer crashes after fetching but before processing, the auto-commit might still commit those offsets, leading to permanent message loss.

To ensure strict "at-least-once" delivery, robust applications disable auto-commit (`enable.auto.commit=false`) and take manual control of committing offsets only *after* the business logic has successfully processed the message.

**The Risks of Immediate Committing (`AckMode.RECORD`):**
When developers switch to manual commits, they often default to committing after every single record is processed (e.g., calling `acknowledgment.acknowledge()` in Spring Kafka with `AckMode.RECORD`). While this seems safe, it carries significant risks:
1.  **Broker Overload:** Every commit is a network request to the Kafka broker (specifically the group coordinator) and a write to the internal `__consumer_offsets` topic. If a consumer is processing 10,000 messages per second, committing after every single message generates 10,000 commit requests per second. This can easily overload the broker's disk I/O and network, degrading cluster performance for all tenants.
2.  **Consumer Throughput Bottleneck:** The consumer thread has to wait for the commit network call to complete (or at least initiate) before moving on. This dramatically slows down the processing rate of the consumer application itself.

**Alternatives and Best Practices:**
Instead of committing after every single record, it is almost always better to commit in batches.
1.  **Batch Commits (`AckMode.BATCH`):** This is the recommended approach. The consumer processes a poll loop of records (e.g., 500 records). Once all 500 records are successfully processed, a single commit request is sent for the highest offset in that batch. This reduces broker load by a factor of 500 while still guaranteeing at-least-once delivery (if a crash happens mid-batch, the entire batch is reprocessed).
2.  **Time-based/Size-based Manual Commits:** The application can keep track of processed offsets and issue an asynchronous commit (`commitAsync()`) every 'N' seconds or every 'M' messages, balancing broker load with the potential number of duplicates upon a crash.

### Examples
```java
// Spring Kafka Listener with AckMode.MANUAL_IMMEDIATE (Not Recommended for high throughput)
@KafkaListener(topics = "topic-a")
public void process(ConsumerRecord<String, String> record, Acknowledgment ack) {
    service.process(record.value());
    ack.acknowledge(); // Triggers a synchronous commit request immediately
}

// Better configuration: AckMode.BATCH (Spring's default when manual acks aren't used)
// Commits once per poll loop automatically after all records in the loop succeed.
@Bean
public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
    ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
    // ... config
    factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.BATCH);
    return factory;
}
```

### Life Analogy
Imagine reading a book and needing to bookmark your progress so you don't lose your place. 
Auto-commit is like a robot trying to place a bookmark every 10 minutes based on what page it thinks you are looking at, which might be wrong if you fell asleep.

Committing after every record (`ACK_IMMEDIATE`) is like calling the publisher on the phone every single time you finish reading a single word to tell them exactly where you are. It's incredibly slow for you and annoys the publisher.

Committing in batches (`BATCH`) is like reading a whole chapter, and then calling the publisher once to say, "I've finished Chapter 3." It's efficient for both you and the publisher.

### Key Points
- Auto-commit is risky because it can commit offsets before messages are actually processed.
- Manual commits should happen *after* successful processing for at-least-once guarantees.
- Committing after every single record causes severe performance degradation and broker overload.
- Committing in batches (once per poll loop) is the standard best practice for balancing performance and reliability.
