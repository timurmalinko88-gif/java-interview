---
id: system-design-004
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 80%
source: Custom
prerequisites: ["Kafka", "RabbitMQ", "Message Brokers"]
tags: [spring-core, system-design, stream-api, collections]
---

# Kafka vs RabbitMQ

Compare Apache Kafka and RabbitMQ. When would you choose Kafka over RabbitMQ, and vice versa? Explain the underlying architectural differences.

---ANSWER---

**RabbitMQ** is a traditional message broker (implementing AMQP).
- *Architecture*: Smart broker / dumb consumer. The broker routes messages to queues based on routing rules.
- *Message Handling*: Messages are typically deleted from the broker once consumed and acknowledged.
- *Use Case*: Complex routing, task queues, pub/sub where messages don't need to be replayed, and per-message acknowledgment is required.

**Apache Kafka** is a distributed event streaming platform.
- *Architecture*: Dumb broker / smart consumer. Kafka is basically a distributed, append-only log. Consumers track their own offsets.
- *Message Handling*: Messages are persisted on disk for a configured retention period, regardless of whether they have been consumed.
- *Use Case*: High throughput, stream processing, event sourcing, log aggregation, and scenarios requiring message replay (reading historical data).

**When to choose which:**
- Choose **RabbitMQ** for point-to-point communication, complex routing, when you need strict ordering for single consumers, or when you need priority queues.
- Choose **Kafka** for massive scale (millions of msgs/sec), event sourcing, stream processing, or when multiple independent consumers need to read the same stream of events at their own pace and potentially replay them.

### Life Analogy
RabbitMQ is like a post office sorting facility: it reads the address, routes the letter to the specific mailbox, and once you pick it up, it's gone from the post office. Kafka is like a public notice board: someone pins a notice, and everyone can read it at their own pace. The notice stays there until it expires, allowing people to read it again if they want.

### Key Points
- RabbitMQ pushes messages and tracks state (deleted on ack); Kafka stores streams of events (logs) and consumers track their own offsets.
- Kafka is built for high throughput and message replay.
- RabbitMQ excels at complex routing and task queues.
