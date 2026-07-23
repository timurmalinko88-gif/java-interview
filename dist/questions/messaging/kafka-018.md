---
id: kafka-018
path: questions/messaging/kafka-018.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Kafka vs RabbitMQ vs AWS SQS
time: 15 min
frequency: High
tags: [kafka, rabbitmq, sqs, architecture, system-design]
---

# Kafka vs RabbitMQ vs AWS SQS
Compare and contrast Apache Kafka, RabbitMQ, and AWS SQS. What are their core architectural differences, and in what specific scenarios would you choose one over the others?

---ANSWER---

While all three are used for asynchronous communication, their underlying architectures and intended use cases are fundamentally different. Understanding these differences is a classic system design requirement.

**1. Apache Kafka (Distributed Event Streaming Platform)**
*   **Architecture:** It is a distributed, append-only commit log. Messages are written to topics (partitions) and persisted to disk. Consumers *pull* data and track their own progress using offsets.
*   **Persistence:** Messages are retained for a configured time (e.g., 7 days) or size, regardless of whether they have been consumed. 
*   **Strengths:** Massive throughput (millions of msgs/sec), high scalability, permanent event history (Event Sourcing), and the ability for multiple independent consumer groups to replay the same data repeatedly.
*   **Use Case:** Real-time analytics, log aggregation, event sourcing, complex stream processing (using Kafka Streams), and acting as the central nervous system for a massive microservice architecture.

**2. RabbitMQ (Traditional Message Broker)**
*   **Architecture:** Implements the AMQP standard. It uses a "Smart Broker / Dumb Consumer" model. Producers send messages to Exchanges, which use complex routing rules (bindings) to push messages into specific Queues. The broker *pushes* messages to consumers.
*   **Persistence:** Once a consumer acknowledges a message, it is instantly deleted from the queue. It is transient storage.
*   **Strengths:** Extremely flexible routing (fanout, topic, direct), exact per-message acknowledgment, low latency, and built-in features like dead-lettering and delayed messages.
*   **Use Case:** Task queues (e.g., sending emails, generating PDFs), point-to-point communication, and scenarios requiring complex routing logic where messages only need to be processed once and then discarded.

**3. AWS SQS (Simple Queue Service)**
*   **Architecture:** A fully managed, cloud-native queue service. It is fundamentally a distributed polling system. 
*   **Persistence:** Like RabbitMQ, messages are transient. Once consumed and explicitly deleted by the consumer, they are gone.
*   **Strengths:** Zero infrastructure management. It scales infinitely and instantly without any provisioning. Very easy to integrate into serverless architectures (AWS Lambda). Standard SQS does not guarantee strict ordering; FIFO SQS guarantees ordering but at a lower throughput.
*   **Use Case:** Cloud-native applications on AWS needing a simple, reliable buffer to decouple components without the operational overhead of managing Kafka or RabbitMQ clusters.

**Summary Choice:**
*   Need to replay historical data, analyze real-time streams, or broadcast the same event to 10 different systems? **Choose Kafka.**
*   Need complex routing logic, exact per-message acknowledgments, and task queuing? **Choose RabbitMQ.**
*   Already heavily invested in AWS, want zero operational maintenance, and just need a simple, infinitely scalable buffer between two services? **Choose SQS.**

### Examples
*   **Kafka:** Uber uses Kafka to track millions of real-time GPS coordinates to calculate surge pricing and match riders with drivers.
*   **RabbitMQ:** An e-commerce site uses RabbitMQ to handle background tasks: Queue A handles sending confirmation emails, Queue B generates PDF invoices.
*   **AWS SQS:** A photo processing app uploads a massive batch of images to S3, triggering thousands of SQS messages. AWS Lambda scales up to process the SQS queue, shrinking back to zero when done.

### Life Analogy
*   **Kafka** is like a public library. The books (messages) are placed on shelves (topics). Many different people (consumers) can come in, read the same book, leave a bookmark (offset) where they stopped, and come back later. The books stay on the shelf for everyone.
*   **RabbitMQ** is like the post office sorting facility. A letter arrives, it is aggressively routed through a maze of tubes (exchanges/bindings) directly to a specific mail carrier's bag (queue). Once the carrier delivers it, it's gone from the post office forever.
*   **SQS** is like a magic, infinitely long conveyor belt managed by someone else. You drop a box on it. The person at the other end eventually picks it up and crushes the box. You never have to worry about oiling the conveyor belt.

### Key Points
- **Kafka:** Log-based, replayable, high throughput, pub/sub, consumers pull, data persists after consumption.
- **RabbitMQ:** Queue-based, complex routing, smart broker pushes to dumb consumers, data deleted after consumption.
- **SQS:** Fully managed cloud queue, zero maintenance, simple decoupling, data deleted after consumption.
