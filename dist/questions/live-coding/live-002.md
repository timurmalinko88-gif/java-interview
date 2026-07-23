---
id: live-002
path: questions/live-coding/live-002.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Race Condition in Money Transfer
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

# Race Condition in Money Transfer
We have a simple `Account` class and a `Bank` service that transfers money between two accounts. Under heavy load with multiple threads transferring money concurrently, the total balance of the bank sometimes magically increases or decreases.

Can you identify the thread-safety issue in the `transfer` method and refactor it to ensure safe concurrent transfers?

---ANSWER---

The issue is a classic race condition. The `transfer` operation consists of a check (has enough balance), a deduction from the source account, and an addition to the target account. If multiple threads execute this concurrently on the same accounts, their operations interleave. The `balance` variable is not protected, so one thread might overwrite the balance calculation of another, causing money to be "created" or "destroyed" out of thin air.

To fix this, we need to synchronize the access to the accounts. However, simply using `synchronized(fromAccount)` and `synchronized(toAccount)` can lead to a deadlock if Thread A transfers from Account 1 to Account 2, and Thread B simultaneously transfers from Account 2 to Account 1. 

The correct fix involves establishing a global ordering for locking the accounts to prevent circular wait deadlocks. A common approach is to lock the accounts based on a unique, immutable identifier, such as their account ID or hash code.

### Examples
```java
// BUGGY CODE:
public void transfer(Account from, Account to, int amount) {
    if (from.getBalance() >= amount) {
        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);
    }
}

// REFACTORED CODE:
public void transfer(Account from, Account to, int amount) {
    // Determine lock order to prevent deadlocks
    Account firstLock = from.getId() < to.getId() ? from : to;
    Account secondLock = from.getId() < to.getId() ? to : from;

    synchronized (firstLock) {
        synchronized (secondLock) {
            if (from.getBalance() >= amount) {
                from.setBalance(from.getBalance() - amount);
                to.setBalance(to.getBalance() + amount);
            }
        }
    }
}
```

### Life Analogy
Imagine two people trying to exchange briefcases of money in a narrow hallway. If both reach for the other's briefcase at exactly the same time, they get stuck in a stalemate (deadlock). To avoid this, we make a rule: whoever has the lower ID badge number must hand over their briefcase first, then the other person follows. This orderly process ensures the exchange always happens safely and without a standoff.

### Key Points
- Race conditions occur when multiple threads read and write shared variables without proper synchronization.
- When acquiring multiple locks, you must acquire them in a consistent, global order to prevent deadlocks.
- Avoid using `synchronized` on method signatures for compound operations spanning multiple objects.
