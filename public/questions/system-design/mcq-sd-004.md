---
id: mcq-sd-004
topic: System Design
difficulty: Senior
format: MCQ
tags: ['system-design', 'caching']
---
What is the caching strategy where the application first writes data to the cache (e.g., Redis), and the cache itself asynchronously writes it to the database?

A. Cache Aside
B. Read Through
C. Write Through
D. Write Behind (Write Back)

---ANSWER---
**Correct Answer: D (Write Behind / Write Back)**

### Key Points
- Write Behind improves write performance since the application does not have to wait for a response from a slow database.
- Disadvantage: The risk of data loss if the cache server crashes before the data reaches the DB.
