---
id: kafka-005
path: questions/messaging/kafka-005.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Consumer Lag (causes, metrics, fixes)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture, operations]
---

# Consumer Lag (causes, metrics, fixes)
What is Kafka Consumer Lag, how do you monitor it, what are its primary causes, and how would you resolve high lag in a production environment?

---ANSWER---

Kafka Consumer Lag is one of the most critical metrics to monitor in any event-driven architecture. It represents the difference between the latest message appended to a partition (the Log End Offset, or LEO) and the last message the consumer group has successfully processed and committed (the Current Offset). In simpler terms, it's how far behind the consumer is from real-time.

**Monitoring:**
Lag should not be monitored by the consumer itself, as a crashed consumer cannot report its lag. Instead, it should be monitored externally. Tools like Burrow (from LinkedIn), Prometheus Kafka Exporter, or Datadog calculate lag by querying the broker for topic end offsets and consumer group committed offsets. Alerts should be set when lag exceeds an acceptable threshold for a sustained period.

**Primary Causes of High Lag:**
1.  **Slow Processing:** The consumer's business logic is taking too long (e.g., slow database queries, slow external API calls, heavy computation).
2.  **Traffic Spikes:** A sudden influx of messages from producers overwhelms the consumers' capacity to keep up.
3.  **Consumer Failures/Rebalances:** Consumers crashing or frequent consumer group rebalances pause processing, causing lag to spike.
4.  **Poison Pills:** A bad message causes the consumer to throw an exception and indefinitely retry, blocking the partition.
5.  **Insufficient Concurrency:** There aren't enough consumer threads or application instances to handle the partition throughput.

**Resolving High Lag:**
*   **Scale Consumers:** If you have more partitions than consumer instances, you can add more instances (up to the number of partitions).
*   **Increase Partitions:** If all partitions are already assigned, you must increase the partition count of the topic to allow for greater parallelism, and then deploy more consumer instances.
*   **Optimize Processing:** Profile the consumer application. Add caching, optimize database queries, or use asynchronous processing for external calls.
*   **Batch Processing:** Instead of processing one message at a time, fetch messages in batches (`max.poll.records`), execute batch database inserts, and commit offsets in bulk.
*   **Implement DLQ/Non-Blocking Retries:** Move poison pills out of the main execution flow to unblock the partition.

### Examples
```java
// Example of optimizing a consumer by batch processing
@KafkaListener(topics = "sensor-data", groupId = "analytics-group",
               containerFactory = "batchFactory") // Configured for batching
public void processBatch(List<ConsumerRecord<String, String>> records) {
    List<DataPoint> dataPoints = new ArrayList<>();
    for (ConsumerRecord<String, String> record : records) {
        dataPoints.add(parseRecord(record.value()));
    }
    
    // Perform one bulk insert instead of N single inserts
    // This dramatically reduces I/O wait time and prevents lag
    databaseRepository.bulkInsert(dataPoints);
}
```

### Life Analogy
Imagine a cashier (consumer) checking out customers in a line (partition).
Consumer Lag is the number of people waiting in line. 

If the line gets too long (high lag), the causes could be: the cashier is slow at scanning (slow processing), a bus tour just arrived (traffic spike), or the cashier is arguing with a customer over an expired coupon (poison pill).

To fix the line, you can open more registers and hire more cashiers (scaling up, increasing partitions), give the cashier a faster barcode scanner (optimizing processing), or move the arguing customer to a separate customer service desk (DLQ).

### Key Points
- Lag is `Log End Offset - Consumer Committed Offset`.
- Indicates how far behind real-time processing the application is.
- Caused by slow logic, traffic spikes, crashes, or blocked partitions.
- Fix by optimizing consumer logic, batching, adding partitions/consumers, or handling poison pills.
