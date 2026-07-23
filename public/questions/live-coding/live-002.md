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

### Problem

The following code implements a bank transfer between two accounts. It suffers from a race condition and potential deadlocks when multiple threads transfer money simultaneously.

**Buggy Code:**

```java
class Account {
    private int balance;
    
    public Account(int initialBalance) {
        this.balance = initialBalance;
    }
    
    public void withdraw(int amount) {
        balance -= amount;
    }
    
    public void deposit(int amount) {
        balance += amount;
    }
    
    public int getBalance() {
        return balance;
    }
}

class Bank {
    public void transfer(Account from, Account to, int amount) {
        synchronized(from) {
            synchronized(to) {
                if (from.getBalance() >= amount) {
                    from.withdraw(amount);
                    to.deposit(amount);
                }
            }
        }
    }
}
```

### Challenge
Refactor the code to ensure thread safety and prevent deadlocks.

---

### Solution

**Explanation:**
The current implementation locks `from` and then `to`. If Thread A transfers from Account 1 to Account 2, and Thread B transfers from Account 2 to Account 1 simultaneously, Thread A locks Account 1, Thread B locks Account 2. Then Thread A waits for Account 2, and Thread B waits for Account 1. This causes a deadlock.
To fix this, we need a consistent locking order. We can use the intrinsic `System.identityHashCode()` to order the locks.

**Refactored Code:**

```java
class Account {
    private int balance;
    
    public Account(int initialBalance) {
        this.balance = initialBalance;
    }
    
    public void withdraw(int amount) {
        balance -= amount;
    }
    
    public void deposit(int amount) {
        balance += amount;
    }
    
    public int getBalance() {
        return balance;
    }
}

class Bank {
    private static final Object tieLock = new Object();

    public void transfer(Account from, Account to, int amount) {
        int fromHash = System.identityHashCode(from);
        int toHash = System.identityHashCode(to);

        if (fromHash < toHash) {
            synchronized(from) {
                synchronized(to) {
                    doTransfer(from, to, amount);
                }
            }
        } else if (fromHash > toHash) {
            synchronized(to) {
                synchronized(from) {
                    doTransfer(from, to, amount);
                }
            }
        } else {
            synchronized(tieLock) {
                synchronized(from) {
                    synchronized(to) {
                        doTransfer(from, to, amount);
                    }
                }
            }
        }
    }

    private void doTransfer(Account from, Account to, int amount) {
        if (from.getBalance() >= amount) {
            from.withdraw(amount);
            to.deposit(amount);
        }
    }
}
```
