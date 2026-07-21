---
id: databases-036
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 85%
source: Custom
prerequisites: ["Hibernate", "JPA"]
---

# What is the First-Level Cache in Hibernate?
Explain the concept of the First-Level Cache in Hibernate/JPA. Is it enabled by default?

---ANSWER---

The First-Level Cache is the mandatory, default caching mechanism in Hibernate. It is associated with the `Session` object (or the `EntityManager` in JPA).

**How it works:**
Whenever you query an entity from the database or save an entity using a specific `EntityManager`, Hibernate stores that entity in its first-level cache (which is essentially a Map inside the EntityManager).
If you request the *same* entity again (by its primary key) within the *same* transaction/session, Hibernate will not hit the database. It will return the object directly from the first-level cache.

**Characteristics:**
- **Enabled by Default:** You cannot turn it off.
- **Scope:** It is session-scoped. It only exists as long as the `EntityManager` is open. Once the session is closed, the cache is destroyed.
- **Isolation:** Data in the first-level cache is not shared with other concurrent sessions/users. Each session has its own private cache.

### Life Analogy
Imagine you are working at your desk (the Session). You ask your assistant to go to the basement archive (Database) to get File #42. The assistant brings it up, and you put it on your desk (First-Level Cache). Five minutes later, you need File #42 again. You don't send the assistant back to the basement; you just grab it from your desk. However, when you go home at 5 PM (Session closes), your desk is cleared.

### Key Points
- Session-scoped cache in Hibernate.
- Enabled by default and cannot be disabled.
- Prevents redundant database hits within a single transaction.
