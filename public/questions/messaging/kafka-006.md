---
id: kafka-006
path: questions/messaging/kafka-006.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Manual Offset Commit risks (ACK_IMMEDIATE)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Manual Offset Commit Risks (ACK_IMMEDIATE)

In Kafka, consumers read messages from partitions and must explicitly or implicitly tell the Kafka broker which messages they have successfully processed. This is done by committing the "offset"—a unique integer identifying the position of the message in the partition.

The choice of *when* and *how* to commit offsets dictates the delivery semantics of your application (At-most-once vs. At-least-once) and heavily impacts data consistency.

## Auto-Commit vs. Manual Commit

**1. Auto-Commit (Default):**
By default (`enable.auto.commit=true`), the consumer periodically commits the highest offset of the messages returned by the *previous* `poll()` call.
*   **Risk:** If the application crashes *after* `poll()` but *before* fully processing all messages, the auto-commit might still run (on a background thread), committing offsets for unprocessed messages. Result: **Data Loss (At-most-once).**

**2. Manual Commit:**
To guarantee At-least-once delivery, developers disable auto-commit (`enable.auto.commit=false`) and manually trigger the commit API (`commitSync()` or `commitAsync()`) only *after* the business logic has successfully processed the message (e.g., saved to a database).

## The Risks of Early/Immediate Manual Commit

A common anti-pattern, especially when using frameworks like Spring Kafka, is to configure the acknowledgment mode to commit immediately upon receiving the message, before processing is complete. In Spring, this is often confused with `AckMode.RECORD` or manually acknowledging at the top of a listener method.

Let's say a developer does this:

```java
@KafkaListener(topics = "orders")
public void processOrder(ConsumerRecord<String, String> record, Acknowledgment ack) {
    // 1. DANGER: Committing before processing!
    ack.acknowledge(); 
    
    // 2. Business Logic
    try {
        databaseRepository.save(record.value());
    } catch (Exception e) {
        // If the DB save fails, the message is already committed!
        // The message is lost forever.
    }
}
```

**The fundamental risk of `ACK_IMMEDIATE` (committing before processing) is Data Loss.** 
If the application crashes, throws an exception, or the downstream system is unavailable during step 2, the message is gone. When the consumer restarts, it will fetch from the *committed* offset, skipping the failed message.

## Synchronous vs. Asynchronous Manual Commits

When committing manually *after* processing, you still have to choose between sync and async commits.

### `commitSync()`
*   **Behavior:** Blocks the consumer thread until the broker acknowledges the commit request. It automatically retries on retriable errors.
*   **Pros:** Reliable. You know the commit succeeded before moving on.
*   **Cons:** Limits throughput because the consumer is blocked waiting for network round-trips to the broker.

### `commitAsync()`
*   **Behavior:** Sends the commit request and immediately returns, allowing the consumer thread to continue processing the next batch.
*   **Pros:** High throughput.
*   **Cons:** No automatic retries. If `commitAsync(offset 10)` fails due to a network blip, and then `commitAsync(offset 20)` succeeds, retrying offset 10 later would be disastrous (it would rewind the consumer backward).

## Best Practices for Manual Commits

To achieve high throughput while maintaining At-least-once guarantees without data loss:

1.  **Commit AFTER Processing:** Never commit an offset until the data is safely persisted or processed in your downstream system.
2.  **Combine Async and Sync:** The standard pattern is to use `commitAsync()` during the normal processing loop to maximize speed, but use a `commitSync()` inside a `finally` block or during a rebalance listener (when partitions are revoked) to ensure the final offset is guaranteed to be committed before the consumer shuts down or loses the partition.

```java
try {
    while (true) {
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
        for (ConsumerRecord<String, String> record : records) {
            processMessage(record);
        }
        // Async commit for speed during normal operation
        consumer.commitAsync(); 
    }
} catch (Exception e) {
    log.error("Unexpected error", e);
} finally {
    try {
        // Sync commit before shutdown to guarantee state
        consumer.commitSync(); 
    } finally {
        consumer.close();
    }
}
```

**Summary:** Manual offset management is essential for robust Kafka applications. However, committing too early (simulating fire-and-forget) introduces severe data loss risks. Always align your commit strategy with your required delivery guarantees, committing only when processing is genuinely complete.
