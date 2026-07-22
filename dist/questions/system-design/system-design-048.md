---
id: system-design-048
topic: System Design
difficulty: Middle
format: Open Answer
time: 15
frequency: 80%
source: Custom
prerequisites: ["Monitoring", "Performance"]
tags: [spring-core, system-design, testing, stream-api, memory, collections]
---

# Long Tail Latency (p99)

When monitoring the performance of an API, why is looking at the "Average" (mean) response time considered a bad practice? Why should you look at percentiles like p95 or p99 instead?

---ANSWER---

**The Problem with Averages:**
If you have an API that serves 100 requests, and 99 of them take `10ms`, but 1 request experiences a massive Garbage Collection pause and takes `1,000ms`, the average response time is:
`(99*10 + 1000) / 100 = 19.9ms`.
Looking at the dashboard, you see `~20ms` average and think the system is perfectly healthy. You completely miss the fact that a user suffered a 1-second delay. Averages hide outliers.

**Percentiles (p50, p90, p99):**
To accurately measure user experience, we sort all response times from fastest to slowest.
- **p50 (Median)**: The middle value. 50% of requests are faster than this, 50% are slower. It's a much better indicator of the "typical" user experience than the mean.
- **p90**: 90% of requests are faster than this value.
- **p99 (Long Tail Latency)**: 99% of requests are faster than this value. Only the worst 1% of requests are slower.

In our example, the p99 latency would clearly show `1,000ms`. 
If Amazon serves millions of requests a day, that "worst 1%" (the p99 tail) represents tens of thousands of users who might abandon their shopping carts due to slowness. Optimizing the p99 latency is crucial for maintaining overall reliability.

### Life Analogy
Imagine measuring the wealth of 10 people in a bar. 9 people have $50,000. Elon Musk walks in with $200 Billion. The "Average" wealth in the bar is now $20 Billion. If you look at the average, you assume everyone is rich. If you look at the median (p50), it accurately shows $50,000.

### Key Points
- Averages are heavily skewed by extreme outliers and hide bad user experiences.
- Percentiles (p50, p99) provide a true picture of performance distribution.
- The p99 tail represents the worst 1% of experiences, which is critical at massive scale.
