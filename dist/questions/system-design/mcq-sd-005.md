---
id: mcq-sd-005
topic: System Design
difficulty: Middle
format: MCQ
tags: ['system-design']
---
Which load balancing algorithm sends a new request to the server with the fewest active connections?

A. Round Robin
B. Least Connections
C. IP Hash
D. Weighted Round Robin

---ANSWER---
**Correct Answer: B (Least Connections)**

### Key Points
- The "Least Connections" algorithm is ideal when requests take varying amounts of time to process. It prevents overloading a server that happens to receive many long-running requests.
