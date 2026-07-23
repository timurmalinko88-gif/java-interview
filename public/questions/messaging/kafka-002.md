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
Explain the Kafka Consumer Group rebalance process, focusing on the differences between the Eager Rebalancing protocol and the Cooperative (Sticky) Rebalancing protocol. What issues does Cooperative Rebalancing solve?

---ANSWER---

A consumer group rebalance in Kafka is the process where partition ownership is redistributed among the active consumers in a group. This happens when a consumer joins the group, a consumer leaves (or crashes), or when partitions are added to the subscribed topics. Rebalancing ensures that all partitions are being read and that the load is distributed, but historically it has been a disruptive process.

**Eager Rebalancing Protocol:**
Before Kafka 2.4, the default protocol was Eager Rebalancing. When a rebalance was triggered, all consumers in the group were required to stop fetching data, revoke ownership of all their currently assigned partitions, and rejoin the group to get a new assignment. 
This process is often referred to as "stop-the-world" rebalancing. Even if a consumer ended up being reassigned the exact same partitions it had before, it still had to drop its state, stop processing, and re-initialize. In large consumer groups or for applications with heavy local state (like Kafka Streams), this downtime can be significant, causing latency spikes and processing delays.

**Cooperative (Sticky) Rebalancing Protocol:**
Introduced to mitigate the "stop-the-world" effect, the Cooperative (or Incremental) Rebalancing protocol takes a phased approach. Instead of forcing all consumers to drop all partitions immediately, it allows consumers to retain partitions that will likely remain assigned to them.
1.  **Phase 1:** The Group Coordinator announces a rebalance. Consumers rejoin but only revoke partitions that *must* be transferred to another consumer to achieve a balanced state. They continue processing the partitions they retain.
2.  **Phase 2:** The revoked partitions are then distributed to their new owners in a subsequent, localized rebalance step.

This means that only the partitions actually changing hands experience downtime. Consumers holding onto their existing partitions keep processing continuously. The "Sticky" aspect refers to the assignor's preference to preserve existing assignments as much as possible, minimizing unnecessary movement of partitions.

Cooperative rebalancing dramatically reduces the latency and disruption caused by rebalances, making it crucial for real-time applications and stateful stream processing where state restoration can take a long time.

### Examples
```java
// Configuring a Spring Kafka consumer to use Cooperative Sticky Assignor
@Bean
public ConsumerFactory<String, String> consumerFactory() {
    Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "my-group");
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    
    // Explicitly set the assignor
    props.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG, 
              CooperativeStickyAssignor.class.getName());
              
    return new DefaultKafkaConsumerFactory<>(props);
}
```

### Life Analogy
Imagine a team of chefs (consumers) cooking dishes from various order tickets (partitions). 

Under Eager Rebalancing, if a new chef joins the kitchen, the manager yells "Stop!". Every single chef must drop the dish they are currently cooking, put the ticket back on the central board, step back, and wait for the manager to reassign all the tickets. It's highly inefficient.

Under Cooperative Rebalancing, when the new chef joins, the manager looks at the board and says, "Chef A, give ticket #3 to the new chef. Everyone else, keep cooking what you have." Only the specific dish being transferred is temporarily paused, while the rest of the kitchen continues operating smoothly.

### Key Points
- Rebalancing redistributes partitions when consumers join/leave or topics change.
- Eager Rebalancing is "stop-the-world", forcing all consumers to revoke all partitions, causing downtime.
- Cooperative (Sticky) Rebalancing is incremental; consumers only revoke partitions that are moving.
- Cooperative rebalancing significantly reduces latency spikes and state restoration overhead in Kafka Streams.
