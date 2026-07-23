---
id: kafka-010
path: questions/messaging/kafka-010.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Compacted Topics & State Stores
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Compacted Topics & State Stores

By default, Apache Kafka topics are configured with a **Time-Based Retention Policy**. Messages are kept in the partition for a specific duration (e.g., `retention.ms=7 days`) or until a size limit is reached. After that, older log segments are deleted. This is ideal for ephemeral event streams (e.g., website clicks, temporary logs).

However, Kafka is also frequently used to store the *current state* of entities (e.g., the current balance of a user's account, or the latest shipping address for a customer profile). If a user hasn't updated their profile in 8 days, a time-based retention policy would delete their data, resulting in data loss. 

For storing state, Kafka provides **Log Compaction**.

## What is Log Compaction?

When a topic is configured with `cleanup.policy=compact`, Kafka's retention logic changes entirely. Instead of deleting messages based on time, Kafka ensures that it retains at least the **most recent message for each unique message key** within the partition.

Think of a compacted topic like a distributed, persistent Key-Value store (like Redis or a database table).

### How Compaction Works

1.  **Key is Mandatory:** For compaction to work, every message published to the topic MUST have a non-null key (e.g., `user-id: 123`).
2.  **The Log Cleaner:** A background thread on the Kafka broker, called the Log Cleaner, periodically scans the partition's closed log segments.
3.  **Deduplication:** If the cleaner finds multiple messages with the same key (e.g., `user:123 -> {status: active}`, and later `user:123 -> {status: suspended}`), it deletes the older messages and keeps only the latest one.
4.  **Tombstone Messages:** To delete an entity entirely, a producer sends a message with the key of the entity (e.g., `user-id: 123`) and a **`null` value**. This is called a tombstone. The Log Cleaner will eventually remove the tombstone and all prior messages for that key, permanently deleting it.

*Note: Compaction does not happen immediately upon publishing. The "tail" (active segment) of the partition still contains duplicates. Compaction only runs on older, closed segments.*

## Use Cases for Compacted Topics

1.  **Reference Data / Caching:** Storing application configurations, product catalogs, or user profiles. Microservices can consume the entire compacted topic on startup to build a fast, local, in-memory cache, knowing they have the latest state of every entity.
2.  **Database Change Data Capture (CDC):** Tools like Debezium use compacted topics to replicate database tables. The Kafka key is the Primary Key of the table. Compaction ensures the Kafka topic doesn't grow infinitely with historical row updates, but acts as a replica of the current table state.
3.  **Kafka Streams State Stores:** This is perhaps the most critical internal use case.

## Kafka Streams and State Stores

Kafka Streams is a library for building stateful stream processing applications (e.g., "count the number of errors per user in the last hour" or "join a stream of orders with a table of customer profiles").

To maintain state, Kafka Streams utilizes **State Stores**. By default, these are embedded RocksDB instances (a fast, local Key-Value store on disk) running directly within the application instances.

### The Problem of Fault Tolerance

If a Kafka Streams application instance crashes, the local RocksDB state is lost. When the instance restarts (or the task migrates to another server), how does it recover its state?

### Compacted Topics as the Source of Truth (Changelog Topics)

To ensure fault tolerance, Kafka Streams automatically backs up every State Store to a dedicated, internal **Compacted Topic** in the Kafka cluster. This is known as a **Changelog Topic**.

1.  When your Kafka Streams app updates the local RocksDB state (e.g., increments a counter for user A), it simultaneously publishes that update to the Changelog compacted topic.
2.  Because it's compacted, the topic size remains manageable; it only contains the latest counter value for each user, not every historical increment.
3.  **Recovery:** If the application crashes, the new instance spinning up will first connect to Kafka, read the Changelog compacted topic from beginning to end, and completely rebuild its local RocksDB State Store before it resumes processing new events from the main input topics.

This elegant architecture allows Kafka Streams applications to be stateless at the infrastructure level (you can kill the pods anytime) while maintaining robust, fault-tolerant state internally, relying on Kafka's compacted topics as the durable source of truth.
