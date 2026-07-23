---
id: kafka-018
path: questions/messaging/kafka-018.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Kafka vs RabbitMQ vs AWS SQS
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Kafka vs RabbitMQ vs AWS SQS

Choosing the right messaging system is a foundational architectural decision. Apache Kafka, RabbitMQ, and AWS SQS are three of the most popular options, but they are built on fundamentally different paradigms and solve different problems.

## 1. Apache Kafka: The Distributed Commit Log

Kafka is not a traditional message queue; it is an event streaming platform built on the concept of an append-only distributed commit log.

*   **Paradigm:** Pub/Sub and Stream Processing.
*   **Storage:** Messages are appended to a log on disk and kept for a configured retention period (e.g., 7 days), regardless of whether they have been consumed.
*   **Consumption:** Consumers read by tracking their "offset" (position) in the log. Multiple distinct consumer groups can read the exact same data independently at different speeds.
*   **Performance:** Massive throughput (millions of messages per second). Highly scalable horizontally via partitioning.
*   **Ordering:** Guaranteed strictly at the partition level.

**Best For:**
*   Event Sourcing architectures.
*   Website activity tracking (clickstreams).
*   Real-time analytics and stream processing (using Kafka Streams/Flink).
*   Scenarios where multiple different services need to react to the exact same historical events.

## 2. RabbitMQ: The Smart Broker (Traditional Message Queue)

RabbitMQ is a traditional message broker implementing the AMQP protocol. It relies on a "smart broker / dumb consumer" model.

*   **Paradigm:** Message Queuing and complex routing.
*   **Storage:** Messages are held in RAM/Disk until they are consumed and acknowledged. Once acknowledged, the broker deletes the message immediately.
*   **Routing:** Extremely powerful routing capabilities. Publishers send messages to an "Exchange," which uses routing keys and binding rules to distribute messages to one or more Queues.
*   **Performance:** High throughput (tens of thousands per sec), but generally lower than Kafka. Excellent low latency.
*   **Ordering:** Guaranteed within a single queue, but complex routing or consumer retries can break global ordering.

**Best For:**
*   Task queues and background job processing (e.g., sending emails, generating PDFs).
*   Complex, fine-grained routing logic (e.g., route logs with level `ERROR` to one queue, and `INFO` to another).
*   Scenarios where you need simple, reliable delivery and immediate message deletion upon success.

## 3. AWS SQS (Simple Queue Service)

SQS is a fully managed, serverless message queuing service provided by AWS.

*   **Paradigm:** Simple Point-to-Point queuing.
*   **Storage:** Managed by AWS. Messages are deleted after consumption or after a maximum retention period (up to 14 days).
*   **Types:** 
    *   *Standard Queues:* Nearly unlimited throughput, but At-Least-Once delivery (duplicates possible) and Best-Effort ordering (messages might arrive out of order).
    *   *FIFO Queues:* Exactly-Once processing and strict First-In-First-Out ordering, but significantly lower throughput limits (3,000 to 30,000 msgs/sec depending on batching).
*   **Operations:** Zero maintenance. You just pay per API request. No clusters to manage or scale.

**Best For:**
*   Cloud-native AWS architectures needing simple decoupling.
*   Teams that want zero operational overhead.
*   Connecting microservices or absorbing load spikes (buffering) where complex routing is not required. (Often paired with AWS SNS for pub/sub).

## Summary Comparison Matrix

| Feature | Kafka | RabbitMQ | AWS SQS |
| :--- | :--- | :--- | :--- |
| **Architecture** | Log-based (Pub/Sub) | Queue-based (Message Broker) | Queue-based (Serverless) |
| **Message State** | Persisted for retention period | Deleted upon acknowledgment | Deleted upon acknowledgment |
| **Routing** | Dumb broker (Topic level only) | Smart broker (Exchanges & Bindings) | Dumb (Direct to queue) |
| **Replayability** | Yes (Just rewind the offset) | No (Once consumed, it's gone) | No |
| **Throughput** | Extreme (Millions/sec) | High (Tens of thousands/sec) | Standard: Infinite. FIFO: Limited. |
| **Maintenance** | High (Requires ZK/KRaft config) | Medium | Zero (Fully Managed) |

**Conclusion:**
*   Use **RabbitMQ** or **SQS** if you want a queue to distribute discrete tasks to workers where the message is irrelevant once processed. Choose SQS if you are on AWS and want zero ops; choose RabbitMQ if you need complex routing or are on-premise.
*   Use **Kafka** if you are building an event-driven architecture where events are a source of truth, require replayability, stream processing, or extreme throughput.
