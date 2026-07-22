---
id: mcq-stream-001
topic: Stream API
difficulty: Middle
format: MCQ
tags: ['stream-api']
---
Which of the following Stream API operations is terminal?

A. map()
B. filter()
C. flatMap()
D. collect()

---ANSWER---
**Correct answer: D (collect)**

### Key Points
- `map`, `filter`, `flatMap` are intermediate operations; they return a new Stream and are executed lazily.
- `collect` is a terminal operation that triggers the actual processing of the pipeline.
