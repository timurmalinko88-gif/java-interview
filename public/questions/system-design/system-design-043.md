---
id: system-design-043
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 70%
source: Custom
prerequisites: ["API Design", "Rate Limiting"]
tags: ['system-design']
---

# Rate Limiting Algorithms (Leaky Bucket vs Sliding Window)

Besides the Token Bucket, explain the Leaky Bucket and Sliding Window Log algorithms for rate limiting. Compare their use cases.

---ANSWER---

**1. Leaky Bucket Algorithm:**
- *How it works*: Imagine a bucket with a hole in the bottom. Requests pour into the top of the bucket. The bucket leaks (processes) requests at a strictly constant rate. If water (requests) pours in faster than it leaks out, the bucket overflows, and new requests are dropped.
- *Pros*: Smooths out traffic bursts entirely. The output rate is strictly constant, which is great for protecting a fragile legacy backend that will crash if hit with a burst.
- *Cons*: A burst of traffic can fill the bucket with old requests, causing new, potentially more important requests to be dropped until the bucket drains.

**2. Sliding Window Log Algorithm:**
- *How it works*: Instead of a fixed window (e.g., 100 requests between 1:00 and 1:01), it tracks the exact timestamp of every single request in a log (usually in Redis). When a new request arrives, it removes all logs older than 1 minute, and counts the remaining logs. If the count exceeds the limit, the request is rejected.
- *Pros*: Extremely precise. Completely eliminates the "boundary effect" of fixed windows (where 100 requests arrive at 1:00:59 and another 100 at 1:01:01, effectively letting 200 requests through in 2 seconds).
- *Cons*: Consumes a massive amount of memory, because you must store the timestamp of every single request for every user.

*(Note: The Sliding Window Counter is a hybrid that combines the memory efficiency of fixed windows with the precision of sliding logs by calculating weighted overlaps).*

### Life Analogy
- **Leaky Bucket**: A single checkout lane at a grocery store. People can rush to the line (burst), but the cashier only processes exactly 1 person per minute. If the line is full, new people are turned away.
- **Sliding Window Log**: A museum that allows exactly 50 people inside at any given time. Every time someone tries to enter, the guard explicitly checks exactly how many people entered in the last 60 minutes and exactly how many left.

### Key Points
- Leaky Bucket enforces a strictly constant output rate (no bursts).
- Sliding Window Log is mathematically precise but consumes high memory.
- Token Bucket remains the most popular compromise.
