---
id: kafka-021
topic: Kafka & Messaging
difficulty: Middle
format: Open Answer
time: 10
frequency: 90%
source: Verdict Review
prerequisites: ["Kafka Architecture", "Consumer Groups", "Delivery Semantics"]
tags: ['verdict-review', 'messaging', 'kafka']
---

# Kafka Offsets, Consumer Groups, and Delivery Semantics

How do Kafka Consumer Groups scale message processing across partitions? Explain how offsets are tracked, the dangers of `enable.auto.commit = true`, and how to guarantee At-Least-Once delivery without data loss.

---ANSWER---

Apache Kafka uses consumer groups and offset tracking to achieve high-throughput, partitioned consumption.

### Consumer Groups & Partition Assignment
- A topic is split into $N$ partitions.
- Within a single **Consumer Group**, each partition is consumed by **at most one** consumer instance at any given time.
- If consumers > partitions, idle consumers wait as standby failovers.
- If consumers < partitions, some consumers read from multiple partitions.

### Offset Tracking (`__consumer_offsets`)
- Every message in a partition has a sequential 64-bit integer ID called an **offset**.
- Kafka stores the current consumed position of each consumer group in an internal compacted topic named `__consumer_offsets`.

### Dangers of `enable.auto.commit = true`
By default, Kafka consumer periodically commits offsets in the background (`auto.commit.interval.ms = 5000`). This causes two critical bugs:
1. **Data Loss:** If the consumer fetches 100 records, the auto-commit interval triggers, and then the worker crashes while processing record #10, records #11–100 will **never be processed** because Kafka thinks they were committed.
2. **Duplicate Processing:** If a long-running batch takes longer than `max.poll.interval.ms`, Kafka assumes the consumer is dead, triggers a **Rebalance**, and assigns the partition to another consumer which re-reads the uncommitted batch.

### Guaranteeing At-Least-Once Processing in Spring Kafka
Disable auto-commit and acknowledge offsets manually after successful processing:

```java
@Configuration
public class KafkaConsumerConfig {
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory(
            ConsumerFactory<String, String> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        // Manual immediate acknowledgment mode
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        return factory;
    }
}

@Service
public class OrderEventConsumer {
    @KafkaListener(topics = "orders", groupId = "order-processor-group")
    public void consume(ConsumerRecord<String, OrderEvent> record, Acknowledgment ack) {
        try {
            processOrder(record.value());
            // Commit offset ONLY after business logic succeeds
            ack.acknowledge();
        } catch (Exception e) {
            // Send to Dead Letter Queue (DLQ) or trigger retry
            log.error("Failed to process event: {}", record.key(), e);
            throw e;
        }
    }
}
```

### Key Takeaways
- 1 partition $ightarrow$ maximum 1 active consumer per group.
- `enable.auto.commit` can cause silent message loss during process crashes.
- At-Least-Once requires explicit manual acknowledgment (`MANUAL_IMMEDIATE`) paired with idempotent consumers.\n