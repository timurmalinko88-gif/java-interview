---
id: mcq-stream-002
topic: Stream API
difficulty: Senior
format: MCQ
tags: [stream-api, parallel]
---
В каком пуле потоков по умолчанию выполняются parallelStream()?

A. CachedThreadPool
B. Специфичном для каждого стрима пуле, который создается при вызове
C. ForkJoinPool.commonPool()
D. SingleThreadExecutor

---ANSWER---
**Правильный ответ: C**

### Key Points
- По умолчанию все параллельные стримы в JVM делят общий глобальный `ForkJoinPool.commonPool()`.
- Если одна долгая блокирующая задача (I/O) займет потоки в commonPool, это негативно повлияет на все другие parallelStream в приложении.
