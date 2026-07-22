---
id: mcq-stream-002
topic: Stream API
difficulty: Senior
format: MCQ
tags: ['stream-api']
---
In which thread pool are parallelStream() executed by default?

A. CachedThreadPool
B. A stream-specific pool that is created upon invocation
C. ForkJoinPool.commonPool()
D. SingleThreadExecutor

---ANSWER---
**Correct answer: C**

### Key Points
- By default, all parallel streams in the JVM share the common global `ForkJoinPool.commonPool()`.
- If one long blocking task (I/O) occupies the threads in the commonPool, it will negatively affect all other parallelStreams in the application.
