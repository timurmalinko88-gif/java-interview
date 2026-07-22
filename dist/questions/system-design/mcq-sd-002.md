---
id: mcq-sd-002
topic: System Design
difficulty: Middle
format: MCQ
tags: ['system-design', 'scaling']
---
What is the difference between horizontal (Scale Out) and vertical (Scale Up) scaling?

A. Vertical means adding new machines to a cluster, horizontal means replacing the processor or adding RAM
B. Horizontal means adding new servers to the pool, vertical means increasing the resources of a single existing machine (CPU/RAM)
C. They are synonyms in the context of microservices
D. Horizontal scaling is only applicable to databases

---ANSWER---
**Correct Answer: B**

### Key Points
- Vertical scaling has a hardware limit and a single point of failure (SPOF).
- Horizontal scaling allows adding an infinite number of replica machines, but requires load balancing and distributed logic.
