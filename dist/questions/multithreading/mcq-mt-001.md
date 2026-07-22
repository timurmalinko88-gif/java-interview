---
id: mcq-mt-001
topic: Multithreading
difficulty: Junior
format: MCQ
tags: ['multithreading', 'thread']
---
Какой метод интерфейса Runnable необходимо реализовать для определения логики потока?

A. start()
B. execute()
C. run()
D. call()

---ANSWER---
**Правильный ответ: C (run)**

### Key Points
- Интерфейс `Runnable` содержит единственный абстрактный метод `run()`.
- Метод `start()` принадлежит классу `Thread` и используется для фактического запуска нового системного потока.
