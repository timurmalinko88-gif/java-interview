---
id: mcq-sd-004
topic: System Design
difficulty: Senior
format: MCQ
tags: [system-design, caching]
---
Как называется стратегия кэширования, при которой приложение сначала пишет данные в кэш (например, Redis), а сам кэш асинхронно записывает их в базу данных?

A. Cache Aside
B. Read Through
C. Write Through
D. Write Behind (Write Back)

---ANSWER---
**Правильный ответ: D (Write Behind / Write Back)**

### Key Points
- Write Behind повышает производительность записи, так как приложению не нужно ждать ответа от медленной базы данных.
- Минус: риск потери данных при сбое кэш-сервера до того, как они попадут в БД.
