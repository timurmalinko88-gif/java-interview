---
id: kafka-008
path: questions/messaging/kafka-008.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Producer Performance tuning (batch.size, linger.ms)
time: 15 min
frequency: High
tags: [kafka, messaging, architecture]
---

# Producer Performance Tuning (batch.size, linger.ms)

Apache Kafka is designed for extremely high throughput. However, to unlock its full potential, you cannot simply send messages one by one. The overhead of network requests, broker-side I/O, and acknowledgments would cripple performance.

The key to high throughput in Kafka is **Batching**. The Kafka Producer is designed to accumulate multiple messages in memory and send them to the broker in a single, larger request. 

Tuning a Kafka producer primarily revolves around balancing two competing metrics: **Throughput** and **Latency**. This balance is controlled primarily by two configurations: `batch.size` and `linger.ms`.

## 1. `batch.size` (The Space Limit)

The `batch.size` configuration (default usually 16KB) determines the maximum size, in bytes, of a single batch of messages destined for a specific partition.

*   When a producer calls `send()`, the message is not immediately sent over the network. It is added to an in-memory buffer (managed by the `RecordAccumulator`) specific to the destination partition.
*   If the accumulated messages in that buffer reach the `batch.size`, the producer will immediately trigger a network request to send the entire batch to the broker.

**Tuning `batch.size`:**
*   **Increase it (e.g., 64KB, 128KB):** If your producer is generating data very quickly, increasing the batch size significantly improves throughput and reduces broker CPU load (fewer, larger requests are much more efficient to process and write to disk). 
*   **Decrease it:** Rarely recommended unless memory on the producer application is extremely constrained.
*   *Note:* A batch size is just a maximum limit. The producer will not wait indefinitely for the batch to fill up. It will send a partially full batch if `linger.ms` is reached.

## 2. `linger.ms` (The Time Limit)

The `linger.ms` configuration (default `0`) dictates how long the producer will wait for a batch to fill up before sending it, even if the `batch.size` has not been reached.

*   **Default Behavior (`linger.ms=0`):** The producer sends the batch immediately as soon as a sender thread is available, even if the batch only contains a single message. This optimizes for the lowest possible latency but sacrifices throughput and increases broker overhead.
*   **Tuning `linger.ms` (e.g., `linger.ms=5` or `10`):** By adding a small artificial delay (e.g., 5 milliseconds), you tell the producer, "Wait just a tiny bit longer to see if more messages arrive for this partition." 

**The Magic Synergy:**
If your application has high traffic, setting `linger.ms=5` might allow 100 messages to accumulate in the buffer within those 5 milliseconds. The producer then sends one request containing 100 messages instead of 100 separate requests. This dramatically increases throughput with an almost imperceptible hit to latency.

## Other Critical Performance Configurations

While `batch.size` and `linger.ms` govern batching, several other settings are vital for overall producer performance:

### 3. `compression.type`

By default, Kafka sends messages uncompressed.
*   **Config:** Set to `snappy`, `lz4`, or `zstd`.
*   **Impact:** Compressing batches (not individual messages) drastically reduces network bandwidth utilization and broker disk space. `lz4` and `snappy` offer an excellent balance of fast compression speed with decent compression ratios. `zstd` offers the best compression ratio but consumes more CPU.
*   **Rule of Thumb:** Always enable compression for high-throughput producers, especially if the payload is JSON or text.

### 4. `acks` (Acknowledgments)

This setting dictates durability vs. latency.
*   **`acks=0`:** Fire and forget. Highest throughput, lowest latency, but severe risk of data loss. (Rarely used).
*   **`acks=1`:** Leader acknowledges. Good balance, but data can be lost if the leader crashes before replicating.
*   **`acks=all` (or `-1`):** Leader and all in-sync replicas (ISRs) must acknowledge. Highest durability, but highest latency. (Recommended for critical data).

### 5. `buffer.memory` and `max.block.ms`

*   **`buffer.memory` (default 32MB):** The total amount of memory the producer can use to buffer messages waiting to be sent to the broker. 
*   If the producer application calls `send()` faster than the broker can accept the data (e.g., broker is slow, network is saturated), the buffer will fill up.
*   **`max.block.ms` (default 60s):** Once `buffer.memory` is full, the `send()` method will block (freeze the application thread). If it blocks longer than `max.block.ms`, it throws a `TimeoutException`. If you are hitting timeouts, you need to either increase `buffer.memory`, speed up the broker, or throttle your application.

## Summary: Tuning for High Throughput

If your goal is to push as much data into Kafka as fast as possible, and a few milliseconds of latency is acceptable, your tuning strategy should be:

1.  Set `linger.ms = 10` (or 20).
2.  Increase `batch.size = 65536` (64KB) or `131072` (128KB).
3.  Enable compression: `compression.type = lz4`.
4.  Ensure `acks` matches your durability requirements (often `all` for financial data, `1` for telemetry).
