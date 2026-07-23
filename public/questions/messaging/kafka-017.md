---
id: kafka-017
path: questions/messaging/kafka-017.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: In-Sync Replicas (ISR) & min.insync.replicas
time: 15 min
frequency: High
tags: [kafka, messaging, architecture, reliability]
---

# In-Sync Replicas (ISR) & min.insync.replicas
What is the ISR (In-Sync Replica) list in Kafka? Explain how the `min.insync.replicas` topic configuration interacts with the producer's `acks=all` setting to guarantee data durability.

---ANSWER---

Kafka achieves high availability and fault tolerance through replication. Every partition has one "Leader" broker, which handles all read and write requests, and multiple "Follower" brokers, which passively replicate the data from the leader.

**The ISR (In-Sync Replica) List:**
The ISR is a dynamically maintained list of replicas (including the leader itself) that are currently "caught up" with the leader.
If a follower broker goes offline, or if a network partition causes it to fall behind the leader by more than a configurable time threshold (`replica.lag.time.max.ms`), the leader removes that follower from the ISR list. When the follower recovers and catches up, it is added back to the ISR.
The ISR is crucial because if the leader broker crashes, Kafka will *only* elect a new leader from the brokers currently in the ISR list, ensuring no committed data is lost during the failover.

**The Interaction of `acks=all` and `min.insync.replicas`:**
When a producer is configured with `acks=all` (or `-1`), it tells the leader broker: "Do not send me a success acknowledgment until you have written the data, AND all replicas currently in the ISR have written the data."

However, consider a scenario where a topic has a replication factor of 3. Two follower brokers crash. The ISR list shrinks down to just 1 (the leader itself). If a producer sends a message with `acks=all`, the leader writes it, sees it is the only one in the ISR, and immediately returns success. If that single leader broker then crashes, the data is permanently lost. `acks=all` became meaningless because the ISR shrank too much.

To prevent this, Kafka provides the topic-level configuration **`min.insync.replicas`**.
This setting dictates the absolute minimum number of replicas that must be in the ISR list for a write with `acks=all` to be accepted.

*   If `replication.factor = 3` and `min.insync.replicas = 2`:
    *   If all 3 brokers are up (ISR=3), writes succeed.
    *   If 1 broker crashes (ISR=2), writes succeed. The data is safe on two disks.
    *   If 2 brokers crash (ISR=1), the ISR falls below the minimum. The leader broker will reject the producer's write request and throw a `NotEnoughReplicasException`.

This configuration enforces a strict trade-off: it sacrifices system availability (the cluster stops accepting writes) to guarantee strict data durability (no data is ever lost).

### Examples
```shell
# Creating a highly durable topic via CLI
kafka-topics.sh --create --bootstrap-server localhost:9092 \
  --topic secure-financial-transactions \
  --partitions 6 \
  --replication-factor 3 \
  --config min.insync.replicas=2 
# This requires producers to use acks=all to leverage the durability
```

### Life Analogy
Imagine a CEO (Leader) who needs to sign a crucial contract. They have two Vice Presidents (Followers) who must co-sign it. The group of people currently in the office is the ISR.

*   `acks=all`: The CEO says, "I will not consider this contract finalized until everyone currently in the office (the ISR) signs it."
*   If both VPs are on vacation, the CEO is the only one in the office. They sign it alone and call it finalized. If the CEO immediately loses the contract, it's gone forever.
*   `min.insync.replicas=2`: A company policy stating, "For a contract to be finalized, there must be a minimum of 2 authorized signers in the office." If both VPs are on vacation, the CEO is physically prevented from signing it, stopping business operations (unavailability) to prevent a catastrophic loss of the sole copy of the contract.

### Key Points
- The ISR is the list of replicas fully caught up with the leader.
- `acks=all` requires all brokers in the *current* ISR to acknowledge the write.
- If the ISR shrinks to 1, `acks=all` behaves like `acks=1`, risking data loss on leader crash.
- `min.insync.replicas` sets a hard floor on the ISR size. If the ISR drops below this, writes are rejected to protect data integrity.
