---
id: kafka-013
path: questions/messaging/kafka-013.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Delivery Guarantees Configs (At-least-once, etc)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture, guarantees]
---

# Delivery Guarantees Configs (At-least-once, etc)
Explain the three types of message delivery guarantees (At-most-once, At-least-once, Exactly-once). How do you configure a Kafka Producer and Consumer to achieve "At-least-once" delivery?

---ANSWER---

In distributed systems, failures like network drops, broker crashes, and application panics are inevitable. Message delivery guarantees describe how a messaging system handles these failures.

**The Three Guarantees:**
1.  **At-Most-Once (Fire and Forget):** A message is sent, and no verification is done. If it gets lost, it's lost forever. It guarantees you will never process a duplicate, but you might lose data.
2.  **At-Least-Once:** A message is sent, and the sender waits for an acknowledgment. If it fails or times out, it retries. This guarantees no data is lost, but a network glitch during the acknowledgment might result in the consumer receiving the same message twice.
3.  **Exactly-Once:** The holy grail. Messages are never lost, and despite retries, the consumer processes the effect of the message exactly one time.

**Configuring for At-Least-Once Delivery:**
At-least-once is the industry standard for most robust microservices. It requires specific configurations on both the Producer and the Consumer.

**Producer Configuration:**
The producer must guarantee the message is safely stored on multiple broker disks before considering it successful.
*   `acks=all` (or `-1`): This is the most critical setting. It tells the broker not to send an acknowledgment back to the producer until the leader partition *and* all In-Sync Replicas (ISRs) have written the message to their logs. If the leader crashes immediately after, a replica already has the data and will take over.
*   `retries=Integer.MAX_VALUE`: If the producer doesn't receive the ack (due to timeout or transient error), it must retry.
*   *(Optional but Recommended)* `enable.idempotence=true`: While strictly used to prevent producer duplicates, it pairs with `acks=all` to ensure safe retries.

**Consumer Configuration:**
The consumer must only commit its offset (telling Kafka "I am done with this message") *after* it has fully processed the message and saved the results to its own database.
*   `enable.auto.commit=false`: You must turn off auto-commit. If left on, Kafka might commit the offset in the background while your processing thread is still working. If the consumer crashes, the offset is already committed, but the work wasn't done, resulting in data loss (At-Most-Once).
*   **Manual Commit:** The consumer code must manually call `commitSync()` or `commitAsync()` only at the very end of the business logic transaction. 

By combining `acks=all` on the producer and manual offset commits on the consumer, you guarantee that a message is never lost, though your consumer must be designed to be idempotent (able to handle duplicates safely) because retries might occur.

### Examples
```java
// At-Least-Once Producer Config
Properties pProps = new Properties();
pProps.put(ProducerConfig.ACKS_CONFIG, "all"); 
pProps.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);
// ensure min.insync.replicas is set to > 1 on the broker topic config!

// At-Least-Once Consumer Pattern
Properties cProps = new Properties();
cProps.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false"); 
KafkaConsumer<String, String> consumer = new KafkaConsumer<>(cProps);

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        try {
            // 1. Do business logic (e.g., save to DB)
            processAndSaveToDatabase(record.value()); 
        } catch (Exception e) {
            // Handle error, maybe break loop, DO NOT commit
            throw e; 
        }
    }
    // 2. Only commit AFTER successful processing
    consumer.commitSync(); 
}
```

### Life Analogy
Imagine sending a package via a courier.
*   **At-Most-Once:** You leave the package on your porch. The courier might pick it up, or a thief might steal it. You never check.
*   **At-Least-Once:** You hand the package to the courier and demand a signed receipt (`acks=all`). If they don't give you a receipt, you give them a duplicate package (`retries`). The receiver only signs for it after opening the box and verifying the contents (`enable.auto.commit=false`). They might get two boxes if the first receipt got lost in the mail, but they will definitely get at least one.
*   **Exactly-Once:** The courier takes the box, puts a unique tracking ID on it, and the receiver's security guard checks the ID. If a duplicate box arrives, the guard throws it away.

### Key Points
- At-Least-Once guarantees no data loss, but allows duplicates.
- Producer needs `acks=all` and retries enabled.
- Consumer needs `enable.auto.commit=false` and must manually commit offsets *after* processing.
- Consumers must be idempotent to handle the inevitable duplicate messages safely.
