---
id: kafka-017
path: questions/messaging/kafka-017.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: In-Sync Replicas (ISR) & min.insync.replicas
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# In-Sync Replicas (ISR) & min.insync.replicas

Apache Kafka achieves high availability and data durability through **Replication**. Every partition in a topic can be replicated across multiple brokers. If a broker fails, the data is not lost because a copy exists on another broker.

Understanding how Kafka manages these replicas—specifically the concept of the ISR list and the `min.insync.replicas` configuration—is critical for balancing data safety against system availability.

## The Replication Mechanics

When you create a topic, you specify a `replication.factor` (usually 3 in production). This means for every partition, there will be 3 copies of the data residing on 3 different brokers.

Among these replicas, one is elected as the **Leader**, and the others are **Followers**.
*   **Leader:** All producers write to the leader. All consumers read from the leader (usually, though Kafka 2.4+ allows reading from followers in specific scenarios to save cross-region bandwidth).
*   **Followers:** Their only job is to passively fetch data from the leader and keep their local logs updated, acting as hot standbys.

## The ISR (In-Sync Replicas) List

The leader maintains a dynamic list called the **ISR (In-Sync Replicas)**. This list contains the IDs of all replicas (including the leader itself) that are currently "caught up" with the leader's data.

**How does a follower stay in the ISR?**
A follower is considered in-sync if it has fetched data from the leader recently (within the `replica.lag.time.max.ms` configuration, typically 10-30 seconds). 

If a follower crashes, loses network connectivity, or becomes too slow (e.g., due to a bad disk), it falls behind. The leader will notice this lag and **kick the follower out of the ISR list**. When the follower recovers and catches up, it is added back to the ISR.

## The Role of `min.insync.replicas`

The ISR list becomes critically important when a producer is configured with `acks=all` (meaning "I want a guarantee that my data is safe before I consider the send successful").

When `acks=all`, the leader receives the message and will not acknowledge it to the producer until *all replicas currently in the ISR list* have successfully written the message to their local disks.

**The Danger Zone:**
Suppose you have `replication.factor=3`. Two followers crash. The ISR list shrinks to just 1 (the leader). 
If a producer sends a message with `acks=all`, the leader writes it locally, sees that it is the *only* one in the ISR, and immediately acknowledges success to the producer. 
If the leader's disk then fails, **the data is permanently lost**, even though the producer requested `acks=all`!

**The Solution:**
To prevent this, you configure **`min.insync.replicas`** (either at the broker level or overridden per topic). 

This setting defines the absolute minimum number of replicas that must be in the ISR list for a producer's `acks=all` request to be accepted.

### Scenarios (Assuming `replication.factor=3`)

*   **`min.insync.replicas=1` (Default in older versions):** Highly available, but dangerous. If 2 brokers go down, writes still succeed, but a subsequent failure of the remaining broker causes data loss.
*   **`min.insync.replicas=2` (The Production Standard):**
    *   *Normal state:* ISR=[1,2,3]. Write succeeds (data on 3 nodes).
    *   *1 broker fails:* ISR=[1,2]. Write succeeds (data on 2 nodes).
    *   *2 brokers fail:* ISR=[1]. The leader receives the producer request. It sees the ISR size (1) is less than `min.insync.replicas` (2). The leader **rejects the write** and throws a `NotEnoughReplicasException` back to the producer.

## The Trade-off: Durability vs. Availability

By setting `min.insync.replicas=2` (with RF=3), you are making a conscious architectural trade-off: **You are choosing to sacrifice write availability to guarantee data durability.**

When two brokers go down, your cluster will refuse new messages (for affected partitions) until at least one follower comes back online and catches up. This prevents the scenario where a lone broker accepts data and then dies, taking the data with it.

*Note: This setting ONLY affects producers using `acks=all`. A producer using `acks=1` or `acks=0` will continue to write successfully even if the ISR falls below the minimum, accepting the risk of data loss.*
