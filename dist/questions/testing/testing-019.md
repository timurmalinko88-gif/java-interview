---
id: testing-019
topic: Testing
difficulty: Middle
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["HTTP"]
tags: [testing, spring-core]
---

# REST Idempotency

What does it mean for an HTTP method to be idempotent?

---ANSWER---

An idempotent method can be called multiple times with the same outcome as calling it once. For example, PUT is idempotent (updating a name to "John" multiple times leaves it as "John"). POST is usually not (calling it twice creates two records).

### Life Analogy
Pressing the elevator button 10 times is idempotent; the elevator still comes once.

### Key Points
- Safe to retry.
- GET, PUT, DELETE are idempotent.
- POST is not.
