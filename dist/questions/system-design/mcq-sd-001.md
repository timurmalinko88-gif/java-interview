---
id: mcq-sd-001
topic: System Design
difficulty: Middle
format: MCQ
tags: ['system-design']
---
According to the CAP theorem, a distributed system can guarantee no more than two of three properties. What are these properties?

A. Consistency, Availability, Partition Tolerance
B. Cacheability, Atomicity, Performance
C. Concurrency, Availability, Persistence
D. Consistency, Asynchrony, Partition Tolerance

---ANSWER---
**Correct Answer: A**

### Key Points
- **C (Consistency)**: Every read receives the most recent write or an error.
- **A (Availability)**: Every request receives a non-error response (without the guarantee that it contains the most recent write).
- **P (Partition Tolerance)**: The system continues to operate despite network drops or delays between nodes.
