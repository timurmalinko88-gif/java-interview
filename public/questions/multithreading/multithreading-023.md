---
id: multithreading-023
topic: Multithreading
difficulty: Senior
format: Code Review
time: 10
frequency: 50%
source: Custom
prerequisites: ["Concurrency", "Livelock"]
tags: ['multithreading']
---

# Livelock vs Deadlock
Review the scenario. Is this a Deadlock, a Livelock, or Starvation? How does it differ from the others?

```java
public class Worker {
    private boolean active;
    public void work(Worker other) {
        while (active) {
            if (other.isActive()) {
                System.out.println("Deferring to other worker...");
                try { Thread.sleep(10); } catch (InterruptedException e) {}
                continue;
            }
            // do work
            active = false;
        }
    }
}
```
*Assume two `Worker` objects are mutually deferring to each other in separate threads.*

---ANSWER---

This scenario is a **Livelock**.

Two threads are actively changing their state in response to each other, but neither is making any actual progress. Both workers see the other is active, defer, sleep, wake up, check again, and defer again, ad infinitum.

**Differences:**
- **Deadlock**: Threads are permanently blocked (waiting on monitors/locks) and consuming zero CPU. They are stuck like stone.
- **Livelock**: Threads are not blocked; they are actively executing code and consuming CPU, but they are stuck in a loop responding to each other without making progress. They are stuck in a dance.
- **Starvation**: A thread wants to make progress but is constantly bypassed by other threads (e.g., due to low priority or greedy threads holding a lock). The starved thread *could* make progress if given a chance, but it never is.

To fix a livelock, randomness is often introduced. For instance, instead of sleeping for exactly 10ms, a thread could sleep for a random duration, breaking the synchronized "dance" and allowing one thread to slip through the condition while the other sleeps.

**Livelock**: Two polite people meet in a hallway. Person A steps to the left. Person B steps to the right (blocking A). Person A steps to the right. Person B steps to the left. They constantly move side to side, actively trying to pass, but never succeeding.
**Starvation**: You are waiting in line at a club, but the bouncer keeps letting VIPs in ahead of you. You aren't stuck, but you never get your turn.

- Deadlocked threads are blocked and do not consume CPU.
- Often resolved by introducing random backoff times (like Ethernet collision resolution).

### Life Analogy
**Deadlock**: Two stubborn people meet in a narrow hallway. Neither will step aside. Both stand completely still forever.

### Key Points
- Livelocked threads are active and consume CPU but make no progress.
