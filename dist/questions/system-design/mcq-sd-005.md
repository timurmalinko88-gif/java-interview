---
id: mcq-sd-005
topic: System Design
difficulty: Middle
format: MCQ
tags: [system-design, load-balancer]
---
Какой алгоритм балансировки нагрузки отправляет новый запрос на сервер с наименьшим количеством активных соединений?

A. Round Robin
B. Least Connections
C. IP Hash
D. Weighted Round Robin

---ANSWER---
**Правильный ответ: B (Least Connections)**

### Key Points
- Алгоритм "Least Connections" идеален, когда запросы занимают разное время на обработку. Он предотвращает перегрузку сервера, который случайно получил много долгих запросов.
