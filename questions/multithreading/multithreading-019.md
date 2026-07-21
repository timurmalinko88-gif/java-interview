---
id: multithreading-019
topic: Multithreading
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Concurrency", "CountDownLatch", "CyclicBarrier"]
---

# `CountDownLatch` vs `CyclicBarrier`
What are the main differences between `CountDownLatch` and `CyclicBarrier` in the `java.util.concurrent` package?

---ANSWER---

Both are synchronization aids that allow one or more threads to wait, but they differ in purpose and reusability.

1. **Purpose**:
   - **`CountDownLatch`**: Typically used when one or more threads need to wait for a set of operations being performed by other threads to complete. (e.g., A main thread waits for 3 worker threads to finish loading config files).
   - **`CyclicBarrier`**: Used when a fixed number of threads must all wait for each other to reach a common barrier point before they can all proceed together. (e.g., 4 threads computing parts of an equation must all finish their part before combining the results).

2. **Reusability**:
   - **`CountDownLatch`**: Cannot be reused once the count reaches zero. You must create a new instance.
   - **`CyclicBarrier`**: Is "cyclic" because it can be reused after the waiting threads are released. 

3. **Action on Trip**:
   - **`CyclicBarrier`** allows you to provide a `Runnable` task that executes exactly once when the barrier is tripped, before the waiting threads are released. `CountDownLatch` does not have this feature.

`CyclicBarrier` is like friends meeting at a restaurant. Nobody orders until everyone arrives at the table (the barrier). Once everyone is there, they order together. Next week, they can reuse the same process for another dinner.

- `CyclicBarrier` is for threads waiting for *each other* at a rendezvous point. It is reusable.
- `CyclicBarrier` supports a barrier action.

### Life Analogy
`CountDownLatch` is like a rocket launch countdown. The commander (main thread) waits for fuel, life support, and navigation to report "ready" (countdown -1). Once it hits zero, the commander fires the rocket. It can't be reused.

### Key Points
- `CountDownLatch` is for waiting on *events* or *other threads* to finish. It is not reusable.
