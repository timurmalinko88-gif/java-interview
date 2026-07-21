---
id: multithreading-026
topic: Multithreading
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Concurrency", "Daemon Threads"]
---

# Daemon Threads
What is a daemon thread in Java, and how does it differ from a user thread? Give an example of when you would use one.

---ANSWER---

In Java, threads are classified into two categories: **User Threads** and **Daemon Threads**.

**Differences:**
The primary difference is how they affect the JVM's lifecycle. The JVM will continue to run as long as there is at least one active **User Thread**. However, the JVM does not wait for **Daemon Threads** to finish. If all User Threads terminate, the JVM will abruptly halt all running Daemon Threads and shut down. 

- **User Threads** are meant for executing the core logic of the application. By default, any thread created by the `main` thread is a user thread.
- **Daemon Threads** are meant to provide background support services for user threads. They are "disposable" threads.

You can make a thread a daemon by calling `thread.setDaemon(true)` *before* calling `start()`.

**Example Use Case:**
The Garbage Collector (GC) is the most famous example of a daemon thread. It runs in the background reclaiming memory. When your main application finishes, you don't want the JVM to stay alive just because the GC is still waiting to clean up memory, so it shuts down automatically. Another example is a background thread periodically saving application state or monitoring system metrics.

### Life Analogy
User threads are the guests at a party. Daemon threads are the cleaning staff. As long as there are guests at the party, the party goes on. But once all the guests leave, the party is over, and the cleaning staff are told to go home, regardless of whether they finished sweeping the floor.

### Key Points
- JVM shuts down when all User threads terminate.
- JVM does not wait for Daemon threads to finish.
- Set via `setDaemon(true)` before `start()`.
- Used for background tasks like garbage collection or monitoring.
