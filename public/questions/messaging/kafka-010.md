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
What is Log Compaction in Kafka, how does it differ from standard time-based retention, and how is it used to build state stores (e.g., KTables in Kafka Streams)?

---ANSWER---

By default, Kafka topics use a time-based or size-based retention policy (e.g., delete messages older than 7 days, or when the partition exceeds 10GB). This is ideal for continuous streams of discrete events (like clickstream data or logs) where old data is no longer relevant.

**Log Compaction (Compacted Topics):**
Log Compaction is a completely different retention strategy. Instead of deleting data based on time, a compacted topic guarantees that it will always retain at least the *most recent known value* for each specific message key.

When compaction runs (via a background thread on the broker), it scans the partition. If it finds multiple messages with the exact same key (e.g., `key: "user-123"`), it deletes the older messages and keeps only the latest one. If a producer sends a message with a key and a `null` value (known as a "tombstone" message), the compactor will eventually delete all records for that key entirely.

Because old, obsolete updates are removed but the latest state for every key is kept forever, compacted topics do not grow infinitely based on time; they only grow based on the number of unique keys.

**Use Case: State Stores and KTables:**
Compacted topics are the foundation of stateful processing in Kafka and are heavily utilized by Kafka Streams (specifically for `KTable` and `GlobalKTable`).

Imagine you are joining a real-time stream of `Orders` against a database of `Customers` to enrich the order with the customer's email address.
1.  You stream the `Customers` database table into a Kafka compacted topic via CDC (Debezium). The key is `customerId`, the value is the customer details.
2.  Your Kafka Streams application reads this compacted topic and builds a local State Store (a local RocksDB instance on the consumer's disk).
3.  Because the topic is compacted, the Kafka Streams app can start from offset 0, read the entire topic, and build a perfectly accurate, up-to-date local cache of all customers without having to read years of historical update events.
4.  If the Kafka Streams application crashes and moves to a new machine, it can quickly rebuild its local state by re-reading the compacted topic.

Without compaction, rebuilding state from a 5-year-old topic would require reading every single update ever made to a customer, taking hours or days. With compaction, you only read the current state, taking seconds.

### Examples
```shell
# Creating a compacted topic using the Kafka CLI tools
kafka-topics.sh --create --bootstrap-server localhost:9092 \
  --topic customer-profiles-compacted \
  --partitions 3 \
  --replication-factor 3 \
  --config cleanup.policy=compact \
  --config min.cleanable.dirty.ratio=0.5
```
```java
// Producing a Tombstone message to delete a key from a compacted topic
// Setting the value to null tells the compactor to delete all records for "user-123"
ProducerRecord<String, String> tombstone = new ProducerRecord<>("customer-profiles-compacted", "user-123", null);
producer.send(tombstone);
```

### Life Analogy
Standard Time-based retention is like a daily newspaper. You keep the papers for a week, then throw them all in the recycling bin. You don't care about last week's weather report.

Log Compaction is like a personal address book. If your friend John moves, you cross out his old address and write the new one. You don't keep a historical list of every place John has ever lived, you only care about his *current* address. The address book only grows when you meet new people (new keys), not as time passes.

### Key Points
- Standard retention deletes data based on age or size.
- Log compaction retains the latest value for every unique message key indefinitely.
- "Tombstone" messages (null value) are used to delete a key entirely.
- Compacted topics are essential for building fast, recoverable State Stores and KTables in Kafka Streams because they allow applications to load current state without replaying all historical changes.
