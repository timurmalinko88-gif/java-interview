---
id: system-design-009
topic: System Design
difficulty: Senior
format: Open Answer
time: 20
frequency: 75%
source: Custom
prerequisites: ["API Design", "Security"]
tags: ['system-design']
---

# Rate Limiting (Token Bucket Algorithm)

Why is rate limiting important in an API? Explain how the Token Bucket algorithm works for rate limiting.

---ANSWER---

**Why Rate Limiting is Important:**
- **Prevent Abuse/DDoS**: Stops malicious users from overwhelming the system.
- **Cost Control**: Prevents excessive usage of expensive third-party APIs or cloud resources.
- **Fairness**: Ensures no single user starves others of system resources.

**Token Bucket Algorithm:**
The Token Bucket is one of the most common rate-limiting algorithms (used by Amazon, Stripe).
1. **The Bucket**: Imagine a bucket associated with a user (or IP) that holds a maximum number of tokens (e.g., 10 tokens).
2. **Refill Rate**: A background process (or mathematical calculation at request time) adds tokens to the bucket at a fixed rate (e.g., 1 token per second). If the bucket is full, extra tokens are discarded.
3. **Consumption**: When a request arrives, the system checks if the bucket has at least 1 token.
   - If *yes*, 1 token is removed, and the request is processed.
   - If *no* (bucket is empty), the request is rejected (HTTP 429 Too Many Requests).

*Pros*: Allows for short bursts of traffic (up to the bucket capacity) while maintaining an overall steady average rate. It's memory efficient and fast to compute.

### Life Analogy
Think of an arcade. You have a cup (bucket) that holds up to 10 tokens. Every hour, your mom gives you 5 tokens (refill rate). You can spend them all at once on 10 games (a burst), but once empty, you have to wait for the next hour to play again.

### Key Points
- Protects systems from DDoS and abusive traffic patterns.
- Token Bucket allows for temporary bursts of traffic.
- Usually implemented using an in-memory datastore like Redis to track the token counts per user/IP.
