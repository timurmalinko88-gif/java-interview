---
id: mcq-sd-006
topic: System Design
difficulty: Senior
format: MCQ
tags: ['system-design']
---
In the context of message queues (e.g., Kafka or RabbitMQ), what does the "At-least-once" delivery guarantee mean?

A. The message will be delivered exactly once without duplicates
B. The message can be lost, but will never be delivered twice
C. The message is guaranteed to reach the consumer, but duplicates may be delivered
D. The message is delivered only when there is an active connection

---ANSWER---
**Correct Answer: C**

### Key Points
- At-least-once: if the consumer does not send an ACK (acknowledgment), the broker will send the message again. Duplicates are possible, so message handlers must be **idempotent**.
- Exactly-once — is the most complex guarantee to implement.
