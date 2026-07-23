---
id: kafka-002
path: questions/messaging/kafka-002.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Consumer Group Rebalance (Sticky/Cooperative)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Consumer Group Rebalance (Sticky/Cooperative)

In Apache Kafka, a Consumer Group allows a set of consumers to collaborate in processing messages from one or more topics. The partitions of the topics are distributed among the active consumers in the group. When the membership of the consumer group changes—for example, a new consumer joins to scale out processing, an existing consumer crashes, or partitions are added to a topic—Kafka must reassign the partitions to the current set of consumers. This process is called a **Rebalance**.

Understanding how rebalancing works and the evolution of rebalance protocols is crucial for maintaining high availability and low latency in stream processing applications.

## The Problem with "Stop-the-World" Rebalancing (Eager Rebalance)

Historically, Kafka used the **Eager Rebalance Protocol** (also known as "stop-the-world"). When a rebalance was triggered, the process followed these steps:
1. **Revoke All Partitions:** Every consumer in the group immediately paused message consumption and gave up all its assigned partitions.
2. **Rejoin Group:** Consumers sent a `JoinGroup` request to the Group Coordinator (a Kafka broker).
3. **Reassign Partitions:** The Group Leader (one of the consumers) computed the new partition assignments based on the partition assignor strategy.
4. **Sync Assignments:** Consumers received their new assignments and resumed fetching messages.

**The issue:** During this entire process, *no messages were consumed by any consumer in the group*. If the group had hundreds of consumers and thousands of partitions, this pause could last several seconds or even minutes, leading to significant consumer lag and processing delays. Furthermore, even if a consumer ended up with the exact same partitions it had before the rebalance, it still had to drop its local state (e.g., caches) and rebuild it, which is highly inefficient for stateful applications like Kafka Streams.

## The Solution: Cooperative Rebalancing (Incremental)

To solve the "stop-the-world" problem, Kafka introduced the **Cooperative Rebalance Protocol** (often associated with the Cooperative Sticky Assignor), starting significantly in Kafka 2.4+.

Cooperative rebalancing works incrementally. Instead of revoking all partitions globally, consumers only revoke partitions that actually need to be transferred to another consumer.

### How Cooperative Rebalancing Works

The cooperative protocol breaks the rebalance into multiple smaller phases:

1. **First Phase - Revoke Only Needed Partitions:** 
   When a rebalance is triggered (e.g., a new consumer joins), existing consumers are notified. They do *not* stop processing their current partitions immediately. The group leader computes the new assignment. Consumers only give up the specific partitions that are being moved to the new consumer. Partitions that remain with their current owner are never paused.
2. **Second Phase - Assign Revoked Partitions:**
   Another quick rebalance round occurs to assign the newly freed partitions to their new owners (e.g., the new consumer).

**Benefits:**
* **No Global Pause:** Consumers continue processing messages from partitions that were not moved. The system remains partially available during the rebalance.
* **Preserved State:** Stateful consumers don't have to unnecessarily drop and rebuild their local state stores if their partition assignments don't change.

## Partition Assignor Strategies

Kafka provides different strategies (assignors) to determine how partitions are distributed:

*   **`RangeAssignor` (Default for old versions):** Works on a per-topic basis. It divides partitions of a topic evenly across consumers. Can lead to imbalance if consumers subscribe to multiple topics with different partition counts.
*   **`RoundRobinAssignor`:** Distributes all partitions from all subscribed topics sequentially to consumers. Better balance than Range, but terrible for state preservation during rebalances (a single failure completely shuffles assignments).
*   **`StickyAssignor` (Eager):** Aims to distribute partitions evenly *and* maintain as many existing assignments as possible during a rebalance to minimize partition movement. However, it still used the stop-the-world eager protocol.
*   **`CooperativeStickyAssignor`:** Combines the sticky assignment logic (minimizing partition movement) with the Cooperative Rebalance Protocol (no global pause). **This is the recommended assignor for modern Kafka applications.**

## Configuration

To enable cooperative rebalancing in a Java consumer, you configure the `partition.assignment.strategy`:

```java
Properties props = new Properties();
props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
props.put(ConsumerConfig.GROUP_ID_CONFIG, "my-group");
// Use the Cooperative Sticky Assignor
props.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG, 
          "org.apache.kafka.clients.consumer.CooperativeStickyAssignor");
props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
```

By switching to `CooperativeStickyAssignor`, large-scale consumer groups experience significantly reduced disruption during scaling events or transient network issues, resulting in much smoother latency profiles.
