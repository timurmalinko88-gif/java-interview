---
id: spring-031
topic: Spring
difficulty: Middle
format: Open Answer
time: 6
frequency: 85%
source: Custom
prerequisites: ["Spring Core", "Transactions"]
tags: ['spring-core']
---

# How does @Transactional work under the hood?
Explain how the `@Transactional` annotation works in Spring. What mechanisms does it use to manage database transactions?

---ANSWER---

The `@Transactional` annotation provides declarative transaction management in Spring. It abstracts away the complex boilerplate code of manually getting connections, starting transactions, committing, and rolling back.

**How it works under the hood:**
Spring uses **AOP (Aspect-Oriented Programming)** and **Proxies** to implement `@Transactional`.

1.  **Proxy Creation:** When Spring detects a bean with the `@Transactional` annotation (on the class or methods), it creates a proxy object that wraps the real bean.
2.  **Interception (Advice):** When an external caller invokes a transactional method on the proxy, a Spring AOP interceptor (specifically `TransactionInterceptor`) steps in *before* the method executes.
3.  **Transaction Start:** The interceptor asks the `PlatformTransactionManager` to start a new transaction (or join an existing one, based on propagation rules). The connection is bound to the current thread using `ThreadLocal`.
4.  **Method Execution:** The interceptor then delegates the call to the actual target method.
5.  **Commit/Rollback:**
    -   If the method executes successfully and returns, the interceptor tells the Transaction Manager to **commit** the transaction.
    -   If the method throws a RuntimeException (or Error), the interceptor catches it and tells the Transaction Manager to **rollback** the transaction.
6.  **Cleanup:** The connection is unbound from the thread and returned to the connection pool.

### Life Analogy
Imagine buying a house (the method execution).
You don't personally write the contracts and transfer the money. You hire a Notary (the Proxy). 
When you say "I want to buy this" (`@Transactional`), the Notary starts the official paperwork (starts transaction). If the inspection passes, the Notary finalizes the sale (commits). If the house fails inspection (throws exception), the Notary tears up the paperwork and you get your deposit back (rollback).

### Key Points
- Works via Spring AOP and Proxies.
- Manages connection state via `ThreadLocal`.
- Automatically starts, commits, or rolls back.
- Bypassed if the method is called from within the same class (Self-invocation problem).
