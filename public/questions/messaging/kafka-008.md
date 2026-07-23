---
id: kafka-008
path: questions/messaging/kafka-008.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Producer Performance Tuning (batch.size, linger.ms)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture, performance]
---

# Producer Performance Tuning (batch.size, linger.ms)
Explain how `batch.size` and `linger.ms` interact in a Kafka Producer, and how you would tune them to optimize for high throughput versus low latency.

---ANSWER---

Kafka achieves its massive throughput primarily through batching. Instead of sending a network request for every single message, the producer groups messages destined for the same partition into batches and sends them in a single network request. 

The two most critical configurations controlling this behavior are `batch.size` and `linger.ms`.

**`batch.size`:**
This configuration specifies the maximum size, in bytes, of a single batch (default is 16KB). When a producer accumulates messages for a partition and hits this size limit, the batch is immediately sent to the broker. 

**`linger.ms`:**
This configuration specifies the maximum amount of time, in milliseconds, the producer will wait for more messages to arrive to try and fill up the batch before sending it (default is 0ms). 

**The Interaction:**
These two settings work together as an "OR" condition. The producer will send the batch of messages to the broker when **EITHER** the `batch.size` is reached **OR** the `linger.ms` time expires.

**Tuning for High Throughput:**
To maximize the number of messages processed per second and minimize broker CPU/network overhead, you want to send larger batches.
*   Increase `batch.size` (e.g., to 64KB, 128KB, or even 256KB).
*   Increase `linger.ms` (e.g., to 10ms, 50ms, or 100ms).
*   *Result:* The producer pauses slightly, accumulates a large number of messages, compresses them efficiently, and sends them in one large payload. This vastly increases throughput at the cost of a slight artificial delay (latency).

**Tuning for Low Latency:**
If your application requires near real-time delivery (e.g., high-frequency trading), you cannot afford to wait for batches to fill.
*   Keep `linger.ms` at 0 (or a very low value like 1ms).
*   *Result:* The producer sends the message almost immediately. If traffic is low, it might send batches containing only a single message. This provides the lowest possible latency but sacrifices overall system throughput and increases the load on the Kafka brokers due to a high volume of small network requests.

*Note on Compression:* Tuning these parameters is highly synergistic with `compression.type` (e.g., `lz4`, `snappy`). Larger batches compress significantly better, further improving throughput and reducing network bandwidth.

### Examples
```java
// Configuring a Producer for High Throughput
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");

// Wait up to 50ms to group messages together
props.put("linger.ms", 50); 

// Allow batches to grow up to 128KB before forcing a send
props.put("batch.size", 131072); 

// Enable compression. Larger batches compress much better!
props.put("compression.type", "snappy"); 

Producer<String, String> producer = new KafkaProducer<>(props);
```

### Life Analogy
Imagine operating a ferry boat (the Producer) transporting cars (messages) across a river to an island (the Broker).

`batch.size` is the physical capacity of the ferry (e.g., it holds 50 cars).
`linger.ms` is the ferry schedule wait time (e.g., wait 15 minutes before departing).

If you want **high throughput**, you set a 15-minute `linger.ms`. You wait for the ferry to fill up with 50 cars. You transport a massive amount of cars per day, very efficiently, but the first car in line had to wait 15 minutes.
If you want **low latency**, you set `linger.ms` to 0. As soon as a single car drives onto the ferry, it departs immediately. The car gets across instantly, but the ferry uses a ton of fuel going back and forth empty, and overall, you can't transport as many cars per day.

### Key Points
- `batch.size` (bytes) and `linger.ms` (time) dictate when a producer sends a network request.
- The batch is sent when *either* limit is reached.
- High Throughput: Increase both `batch.size` and `linger.ms` to send large, efficient, highly-compressible payloads.
- Low Latency: Keep `linger.ms` at 0 to send messages immediately, sacrificing overall throughput.
