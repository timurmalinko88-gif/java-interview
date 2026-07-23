---
id: kafka-007
path: questions/messaging/kafka-007.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Partitioning Strategy & Hot Partitions
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Partitioning Strategy & Hot Partitions

In Apache Kafka, a topic is divided into one or more **partitions**. Partitions are the fundamental unit of parallelism and scalability. While a topic is a logical concept, partitions are the physical directories on the broker's disk where the actual message segments are stored.

Because a single consumer within a group can only read from a given partition at a time, the number of partitions dictates the maximum parallel consumer throughput.

## How Partitioning Works (The Default Strategy)

When a producer sends a message to a topic, it must decide which partition to write to. This decision is made by the `Partitioner`.

By default (the `DefaultPartitioner`):
1.  **If a Key is specified:** Kafka uses a hash of the key to determine the partition: `hash(key) % num_partitions`. This guarantees that all messages with the same key will always go to the same partition, ensuring strict ordering for that specific key.
2.  **If NO Key is specified (null):** 
    *   *Older Kafka versions:* Used a simple round-robin approach.
    *   *Newer Kafka versions (2.4+):* Uses **Sticky Partitioning**. The producer sticks to a single partition until a batch is full or `linger.ms` is reached, then switches to another partition. This drastically improves batching efficiency and reduces latency compared to strict round-robin.

## The Problem: Hot Partitions

A "Hot Partition" occurs when the distribution of messages across the partitions of a topic becomes heavily skewed. One or a few partitions receive a massive influx of messages, while other partitions sit relatively idle.

### Consequences of Hot Partitions:
1.  **Broker Overload:** The specific broker hosting the leader replica for the hot partition can become bottlenecked on CPU, disk I/O, or network bandwidth, degrading the performance of the entire cluster.
2.  **Consumer Lag:** The consumer assigned to the hot partition will be overwhelmed. Since a partition cannot be split among multiple consumers in the same group, that single consumer instance becomes the bottleneck for the entire application, resulting in severe consumer lag.
3.  **Storage Imbalance:** Disks on brokers hosting hot partitions will fill up much faster than others.

### Causes of Hot Partitions:
The root cause is almost always an unevenly distributed message key. 

*   **Example 1 (Tenant ID):** You use `tenant_id` as the key. If Tenant A generates 90% of your system's traffic, the partition handling Tenant A's hash will become red-hot.
*   **Example 2 (Coarse Grained Keys):** You use a boolean `is_active` as a key. All messages hash to only two partitions, regardless of how many partitions the topic actually has.

## Solving Hot Partitions

Mitigating hot partitions requires changing how data is routed on the producer side.

### 1. Change the Partitioning Key (Best Approach)

If possible, select a key with higher cardinality and a more uniform distribution.
*   Instead of `tenant_id`, use `tenant_id + "-" + user_id`.
*   If ordering is not strictly required across all entities of a tenant, use a unique ID (like UUID) as the key, or use a `null` key to leverage sticky partitioning for perfectly even distribution.

### 2. Salting the Key

If you *must* maintain some level of ordering but need to break up a massive tenant, you can "salt" the key.
*   Append a random number to the key: `tenantA-1`, `tenantA-2`, `tenantA-3`.
*   This splits the traffic for that tenant across 3 partitions. 
*   **Trade-off:** You lose strict global ordering for `tenantA`. You only maintain ordering within the sub-groups (`tenantA-1` is ordered, but it might be processed concurrently with `tenantA-2`). The consumer must be designed to handle this partial ordering.

### 3. Custom Partitioner

You can write a custom Java class implementing the `org.apache.kafka.clients.producer.Partitioner` interface. This allows you to implement complex logic.
*   **Example:** A custom partitioner that usually hashes by `tenant_id`, but has a hardcoded list of "whale" tenants. When it sees a whale tenant, it uses a round-robin strategy across a subset of partitions just for them.

```java
public class WhalePartitioner implements Partitioner {
    private List<String> whales = Arrays.asList("tenant-huge-1", "tenant-huge-2");

    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        int numPartitions = cluster.partitionsForTopic(topic).size();
        String stringKey = (String) key;

        if (whales.contains(stringKey)) {
            // Distribute whales randomly across all partitions
            return ThreadLocalRandom.current().nextInt(numPartitions);
        } else {
            // Normal hash for everyone else
            return Math.abs(Utils.murmur2(keyBytes)) % (numPartitions - 1); 
        }
    }
    // ... other methods
}
```

### 4. Separate Topics

In extreme cases, the best architectural decision is to isolate the noisy neighbor completely by routing their traffic to a dedicated topic with its own dedicated infrastructure and consumer group.

**Summary:** Proper key selection is the most crucial design decision in a Kafka architecture. A poor key leads to hot partitions, which undermine Kafka's horizontal scalability and cause persistent consumer lag.
