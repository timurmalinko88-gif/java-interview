---
id: databases-047
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 95%
source: Custom
prerequisites: ["Spring", "Transactions"]
tags: [oop, spring-core, patterns, databases, exceptions]
---

# Explain the @Transactional annotation in Spring.
What is the purpose of the `@Transactional` annotation in Spring, and how does it work conceptually?

---ANSWER---

The `@Transactional` annotation in Spring is used for declarative transaction management. It relieves the developer from writing boilerplate code to manually open, commit, or roll back database transactions.

**How it works:**
1.  You place `@Transactional` on a class or a specific method (usually in the Service layer).
2.  When that method is called, Spring intercepts the call using AOP (Aspect-Oriented Programming) Proxies.
3.  Before the method executes, the proxy opens a database transaction.
4.  The method executes its business logic (e.g., saving data to the database).
5.  If the method completes successfully, the proxy automatically commits the transaction.
6.  If the method throws a RuntimeException (by default), the proxy automatically rolls back the transaction, undoing all database changes made during the method execution.

### Life Analogy
Imagine a VIP shopping experience.
Without `@Transactional`, you walk into a store, open your wallet, pay for an item, put your wallet away. You do this for every single item.
With `@Transactional`, you are assigned a personal shopper (the Proxy). You just point at things you want. The shopper keeps a running tab (opens transaction). When you are ready to leave, if you are happy, they swipe your card once for everything (Commit). If you get angry and storm out, they put everything back on the shelves (Rollback). You never touched your wallet.

### Key Points
- Provides declarative transaction management in Spring.
- Automatically begins, commits, or rolls back transactions.
- Implemented using Spring AOP Proxies.
