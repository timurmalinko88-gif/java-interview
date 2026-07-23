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
How does Kafka determine which partition a message is written to, and how would you identify and resolve a "Hot Partition" issue in production?

---ANSWER---

Kafka topics are divided into partitions, which are the fundamental unit of scalability and parallelism. How a producer distributes messages across these partitions is critical to the performance of both the Kafka cluster and the consumer applications.

**Partitioning Strategies:**
When a producer sends a record, it determines the partition using the following logic (in the default Java client):
1.  **Explicit Partition:** If the producer record explicitly specifies a partition number, it is used directly. (Rarely used in practice).
2.  **Key-based (Hashing):** If a message key is provided (e.g., `customerId` or `orderId`), the producer takes a hash of the key (usually Murmur2) and modulo divides it by the number of partitions. This guarantees that all messages with the same key will always go to the exact same partition, preserving strict ordering for that specific key.
3.  **Round-Robin / Sticky Partitioning:** If no key is provided, older Kafka clients used strict round-robin. Modern clients (Kafka 2.4+) use "Sticky Partitioning" to improve batching efficiency. The producer randomly chooses a partition, "sticks" to it until a batch is full or `linger.ms` expires, and then randomly chooses a new partition for the next batch.

**The "Hot Partition" Problem:**
A "Hot Partition" occurs when one partition receives a disproportionately massive volume of data compared to the other partitions in the same topic. This creates a severe bottleneck because a single broker handles the bulk of the disk I/O, and the single consumer thread assigned to that partition falls completely behind (causing lag), while other consumer threads sit idle.

**Causes of Hot Partitions:**
The most common cause is a skewed message key distribution. For example, if you key messages by `tenantId`, and one massive enterprise customer accounts for 60% of your traffic, 60% of all messages will hash to the exact same partition.

**Resolving Hot Partitions:**
1.  **Change the Key:** The most effective fix is to choose a more evenly distributed key. Instead of just `tenantId`, you might use a composite key like `tenantId_userId` or `tenantId_deviceId`.
2.  **Salt the Key:** If ordering is only strictly required within a smaller subset, append a random number or a timestamp to the key (e.g., `tenantId_1`, `tenantId_2`). This breaks the strict ordering for the whole tenant but distributes the load.
3.  **Two-Step Processing:** For extreme cases, publish the messages without a key (so they round-robin evenly to all partitions) to a staging topic. A fast, parallel consumer group reads them, performs heavy processing, and then republishes the enriched, smaller results to a final topic using the original key.

### Examples
```java
// Problematic: Highly skewed key leads to a hot partition
String tenantId = getTenantId(event); // If "BigCorp" is 90% of traffic, one partition burns
ProducerRecord<String, String> record = new ProducerRecord<>("events-topic", tenantId, payload);
producer.send(record);

// Solution 1: Composite Key for better distribution
String compositeKey = tenantId + "-" + event.getUserId(); 
ProducerRecord<String, String> record2 = new ProducerRecord<>("events-topic", compositeKey, payload);
producer.send(record2);
```

### Life Analogy
Imagine a toll plaza (Kafka topic) with 5 lanes (partitions). 

Key-based routing is like dedicating lanes based on the color of a car. All blue cars go to lane 1, red to lane 2. 
A Hot Partition happens if 80% of the town drives blue cars. Lane 1 will have a massive traffic jam stretching for miles (high lag, broker overload), while the toll booth operators in lanes 2-5 are drinking coffee with no cars in sight.

To fix it, you have to change the routing rules (change the key) to use something more evenly distributed, like the last digit of the license plate, so all lanes are utilized equally.

### Key Points
- Messages with keys are hashed to specific partitions to guarantee order per key.
- Messages without keys are distributed using Sticky Partitioning (or round-robin) for even load.
- Hot Partitions occur when a poorly chosen key causes one partition to receive the majority of traffic.
- Hot Partitions cause broker overload and consumer lag. Fix them by using composite keys or salting to improve data distribution.
