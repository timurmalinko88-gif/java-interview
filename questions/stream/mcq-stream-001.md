---
id: mcq-stream-001
topic: Stream API
difficulty: Middle
format: MCQ
tags: [stream-api, intermediate, terminal]
---
Какая из следующих операций Stream API является терминальной (terminal)?

A. map()
B. filter()
C. flatMap()
D. collect()

---ANSWER---
**Правильный ответ: D (collect)**

### Key Points
- `map`, `filter`, `flatMap` — это промежуточные (intermediate) операции, они возвращают новый Stream и выполняются лениво.
- `collect` — терминальная операция, запускающая реальную обработку пайплайна.
