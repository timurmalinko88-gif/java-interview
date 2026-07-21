---
id: multithreading-015
topic: Multithreading
difficulty: Middle
format: Code Review
time: 8
frequency: 65%
source: Custom
prerequisites: ["Concurrency", "Deadlocks"]
---

# Deadlock Code Review
Review the following code. Identify the potential problem and explain how it can occur.

```java
public class TransferService {
    public void transfer(Account from, Account to, int amount) {
        synchronized(from) {
            synchronized(to) {
                from.withdraw(amount);
                to.deposit(amount);
            }
        }
    }
}
```

---ANSWER---

The code suffers from a potential **deadlock**.

A deadlock occurs when two or more threads are blocked forever, waiting for each other to release locks.

In this code, the order in which the locks are acquired depends on the parameters passed to the `transfer` method. Consider the scenario where two threads try to transfer money simultaneously between the same two accounts but in opposite directions:
- Thread 1 calls `transfer(accountA, accountB, 100)`
- Thread 2 calls `transfer(accountB, accountA, 50)`

Execution sequence:
1. Thread 1 acquires the lock on `accountA`.
2. Thread 2 acquires the lock on `accountB`.
3. Thread 1 tries to acquire the lock on `accountB`, but it's held by Thread 2. It blocks.
4. Thread 2 tries to acquire the lock on `accountA`, but it's held by Thread 1. It blocks.

Both threads are now waiting for each other indefinitely. 

**Fix**: To prevent this, locks must always be acquired in a consistent, global order. For example, comparing the unique IDs (or hash codes) of the accounts and always locking the one with the smaller ID first.

- Always acquire multiple locks in a fixed, global order.
- Thread dumps or tools like JConsole can help identify deadlocks.

### Life Analogy
Imagine two narrow one-way bridges crossing a river in opposite directions. A deadlock is like two cars entering the bridges from opposite sides and meeting in the middle where there's only one lane. Neither can move forward, and neither will back up. They are permanently stuck.

### Key Points
- Deadlocks occur when lock acquisition order is inconsistent.
