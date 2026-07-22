---
id: system-design-046
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 60%
source: Custom
prerequisites: ["Networking", "Resiliency"]
tags: ['system-design']
---

# Backpressure

What is Backpressure in the context of system design? Why is it necessary, and how is it implemented?

---ANSWER---

**The Problem:**
Imagine a fast Producer (e.g., a data ingestion API receiving 10,000 logs/sec) sending data to a slow Consumer (e.g., a Database that can only write 2,000 logs/sec). If the Producer keeps pushing blindly, the Consumer's memory buffers will fill up, and it will eventually crash with an OutOfMemory error.

**Backpressure** is a mechanism where the Consumer signals the Producer to slow down or stop sending data until the Consumer catches up.

**Implementation Strategies:**
1. **TCP Window Size**: At the network layer, TCP natively supports backpressure. The receiver advertises a "window size" (how much buffer space it has left). If it drops to zero, the sender pauses transmission.
2. **Reactive Streams**: In Java (Project Reactor / RxJava), consumers can explicitly request a specific number of items (e.g., `request(10)`). The publisher will push exactly 10 items and stop until the consumer asks for more.
3. **HTTP 429 (Rate Limiting)**: If an API is overwhelmed, it returns HTTP 429 Too Many Requests, forcing the client to back off and retry later.
4. **Message Brokers**: Using Kafka acts as an implicit buffer. The producer writes fast to Kafka, and the consumer reads at its own slow pace. The backpressure is absorbed by Kafka's disk storage.

### Life Analogy
Imagine a conveyor belt at a supermarket checkout. You (Producer) are throwing groceries on the belt fast. The cashier (Consumer) is scanning slowly. The groceries start piling up. Backpressure is the cashier hitting a button to stop the conveyor belt so they can catch up, then turning it back on when they are ready.

### Key Points
- A flow-control mechanism allowing a slow consumer to push back against a fast producer.
- Prevents resource exhaustion and system crashes.
- Implemented natively in TCP, via Reactive Streams, or buffered by Message Brokers.
