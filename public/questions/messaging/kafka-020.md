---
id: kafka-020
path: questions/messaging/kafka-020.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Troubleshooting Poison Pill messages
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Troubleshooting Poison Pill Messages

In Kafka terminology, a **"Poison Pill"** is a message in a topic that a consumer cannot process. Every time the consumer fetches this specific message and attempts to process it, it throws an exception (e.g., a deserialization error or a parsing exception).

Because Kafka guarantees ordering within a partition, the consumer cannot simply skip the bad message and move on to the next one automatically (unless specifically configured to do so). It will continuously fetch the poison pill, fail, and retry. This blocks the entire partition; all subsequent, perfectly valid messages queue up behind the poison pill, leading to massive consumer lag.

## Common Causes of Poison Pills

1.  **Deserialization Failures:** The most common cause. The producer changed the data format (e.g., from String to JSON, or updated an Avro schema incompatibly without a Schema Registry), and the consumer's `Deserializer` fails to parse the byte array.
2.  **Malformed Data:** The message is technically valid JSON/String, but it lacks mandatory business fields, causing NullPointerExceptions in the application logic.
3.  **Data Type Mismatches:** The JSON contains a String `"NaN"` where the consumer expects a standard Integer field.

## How to Handle and Bypass Poison Pills

When a poison pill halts production, you need immediate mitigation strategies.

### 1. ErrorHandlingDeserializer (Spring Kafka Specific)

If the poison pill is caused by a deserialization error (e.g., Jackson fails to parse JSON), the exception is thrown *before* the message ever reaches your `@KafkaListener` method. Therefore, try-catch blocks in your business logic will not catch it.

Spring Kafka provides the `ErrorHandlingDeserializer`. It acts as a wrapper around your actual deserializer (like `JsonDeserializer`).

*   If deserialization succeeds, it passes the object to your listener.
*   If deserialization fails, it catches the exception, creates a dummy record, and passes *that* to your listener (or routes it to a Dead Letter Queue if configured). This prevents the infinite loop and allows the consumer to commit the offset and move past the bad message.

```yaml
# Spring Boot application.yml
spring:
  kafka:
    consumer:
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.deserializer.value.delegate.class: org.springframework.kafka.support.serializer.JsonDeserializer
```

### 2. Dead Letter Queues (DLQ) for Business Logic Errors

If the message deserializes fine but fails in your business logic (e.g., missing mandatory fields), you should catch the exception and route the message to a Dead Letter Queue (DLQ).

As discussed in earlier topics, you can implement this manually or use Spring's `@RetryableTopic` and `@DltHandler`. The consumer logs the error, publishes the raw payload to the `my-topic-dlq`, and then acknowledges the offset on the original topic, bypassing the blockage.

### 3. Manual Offset Advancement (The "Nuclear Option")

If you don't have DLQs or ErrorHandlingDeserializers set up, and a poison pill is currently blocking production, you must manually move the consumer group's offset past the bad message.

You can do this using the Kafka CLI tools.

1.  **Identify the Lagging Partition and Offset:**
    ```bash
    kafka-consumer-groups.sh --bootstrap-server broker:9092 --describe --group my-app-group
    ```
    Find the partition with high lag. Note the `CURRENT-OFFSET`. Let's say the poison pill is at offset `1005`.

2.  **Stop the Consumers:**
    You MUST stop all instances of the consumer application. You cannot alter offsets while the group is active.

3.  **Reset the Offset:**
    Move the offset forward by 1 (to skip the bad message at 1005).
    ```bash
    kafka-consumer-groups.sh --bootstrap-server broker:9092 --group my-app-group \
        --topic my-topic:0 --reset-offsets --to-offset 1006 --execute
    ```
    *(Where `:0` is the specific partition number).*

4.  **Restart the Consumers:**
    Bring the application back online. It will start consuming from `1006`, leaving the poison pill behind.

## Prevention is the Best Cure

The ultimate fix for poison pills is to prevent them from entering the topic in the first place:
1.  **Schema Registry:** Use Avro/Protobuf with a Schema Registry to strictly enforce contracts. Producers will be blocked from sending invalid structures.
2.  **Producer Validation:** Ensure producers thoroughly validate data before calling `send()`.
