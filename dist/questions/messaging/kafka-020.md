---
id: kafka-020
path: questions/messaging/kafka-020.md
topic: Kafka & Messaging
difficulty: Senior
format: Open Answer
title: Troubleshooting Poison Pill Messages
time: 15 min
frequency: High
tags: [kafka, operations, debugging, troubleshooting]
---

# Troubleshooting Poison Pill Messages
A specific Kafka partition is experiencing severe lag, while others are fine. You suspect a "Poison Pill" message is blocking the consumer. Walk through the exact steps and CLI tools you would use to identify, inspect, and bypass the problematic message in a production environment.

---ANSWER---

A "Poison Pill" is a message that consistently causes the consumer application to throw an unhandled exception (e.g., a malformed JSON payload causing a deserialization error, or missing required fields causing a NullPointerException). Because Kafka guarantees ordered processing within a partition, the consumer fails, retries indefinitely, and entirely blocks the processing of all subsequent messages in that partition.

Here is the operational playbook to resolve this when no Dead Letter Queue (DLQ) is automatically configured.

**Step 1: Identify the Stalled Partition and Offset**
First, determine exactly which partition is stuck and at what offset. Use the consumer groups CLI tool:
```bash
kafka-consumer-groups.sh --bootstrap-server broker:9092 --describe --group my-app-group
```
Look at the output. You will see one partition where the `CURRENT-OFFSET` is completely static, while the `LOG-END-OFFSET` (and therefore the `LAG`) is continuously increasing. Note the `TOPIC`, `PARTITION`, and the `CURRENT-OFFSET` (e.g., Offset 1500 on Partition 2). This offset is the poison pill.

**Step 2: Inspect the Poison Pill (Optional but recommended)**
Before skipping it, you should see what the message actually is to fix the upstream producer bug later. Use the console consumer to read *only* that specific offset:
```bash
kafka-console-consumer.sh --bootstrap-server broker:9092 \
  --topic my-topic \
  --partition 2 \
  --offset 1500 \
  --max-messages 1 \
  --property print.key=true
```
Save this payload for the development team to analyze.

**Step 3: Bypass the Poison Pill (Reset the Offset)**
To unblock the application, you must instruct the consumer group to skip the bad message. You do this by manually moving the consumer group's committed offset past the poison pill.

*Crucial:* The consumer application must be stopped before you can alter its offsets.

1.  Stop the consumer application instances.
2.  Use the CLI to shift the offset forward by one (e.g., from 1500 to 1501):
```bash
kafka-consumer-groups.sh --bootstrap-server broker:9092 \
  --group my-app-group \
  --topic my-topic:2 \
  --reset-offsets \
  --shift-by 1 \
  --execute
```
*(Alternatively, you can use `--to-offset 1501`)*
3.  Restart the consumer application.

Upon restart, the consumer will fetch starting from offset 1501, successfully skipping the poison pill, and quickly burn through the accumulated lag.

**Long-Term Fix:**
Manually skipping offsets is an emergency operational procedure. The architectural fix is to wrap the deserialization and processing logic in `try-catch` blocks and implement a Non-Blocking Retry and Dead Letter Queue (DLQ) pattern, so poison pills are automatically routed out of the main partition without human intervention.

### Examples
```bash
# Example Output of Step 1 (Describe Group)
GROUP           TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             
my-app-group    orders-topic    0          2005            2006            1               
my-app-group    orders-topic    1          1890            1892            2               
my-app-group    orders-topic    2          1500            8500            7000  <-- STUCK HERE
```

### Life Analogy
Imagine a record player (consumer) playing a vinyl record (partition). The needle moving along the groove is the offset. 
A poison pill is a deep scratch on the record. When the needle hits the scratch, it skips backwards and plays the same half-second of music over and over again infinitely. The rest of the song (the lag) never gets played.

To fix it, you have to physically lift the needle (stop the consumer application) and move it just past the scratch (reset the offset forward by 1). Then you put the needle back down (restart the app), and the rest of the song plays normally.

### Key Points
- A poison pill is a message causing infinite retries, blocking the entire partition.
- Use `kafka-consumer-groups.sh --describe` to find the stuck partition and the specific offset.
- Use `kafka-console-consumer.sh` targeting that exact partition and offset to inspect the bad data.
- Stop the consumer, use `--reset-offsets --shift-by 1` to manually move past the bad message, then restart.
- Prevent this operationally by implementing a DLQ.
