---
id: databases-037
topic: Databases
difficulty: Senior
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Hibernate", "First-Level Cache"]
---

# What is the Second-Level Cache in Hibernate?
Explain the Second-Level Cache. How does it differ from the First-Level Cache, and when should you use it?

---ANSWER---

The Second-Level (L2) Cache is an optional caching layer in Hibernate that sits above the First-Level Cache. It is associated with the `SessionFactory` (or `EntityManagerFactory`).

**How it works:**
If a session requests an entity, Hibernate first checks the First-Level cache. If it's not there, it checks the Second-Level cache. If found there, it's returned. Only if it misses both caches does Hibernate query the database. When data is fetched from the DB, it populates both caches.

**Characteristics compared to L1 Cache:**
- **Disabled by Default:** You must explicitly configure a cache provider (like Ehcache, Hazelcast) and enable it in properties.
- **Scope:** It is application-scoped (or cluster-scoped). It survives across multiple sessions and transactions.
- **Shared:** Data in the L2 cache is shared among all concurrent users and sessions in the application.

**When to use it:**
Use L2 caching for data that is read frequently but modified rarely (e.g., country lists, configuration settings, product catalogs). 
*Do not* use it for highly volatile data, as keeping the cache synchronized with the database becomes an expensive bottleneck.

### Life Analogy
- **L1 Cache:** The files on your personal desk (Session). Only you can see them, and they are thrown away when you leave.
- **L2 Cache:** A shared department filing cabinet on your floor (SessionFactory). If you need a file, you check your desk first. If it's not there, you check the shared cabinet before walking all the way to the basement archive (Database). Anyone in the department can use the shared cabinet.

### Key Points
- Application-scoped cache associated with the SessionFactory.
- Disabled by default; requires a third-party provider.
- Shared across all sessions.
- Best used for read-heavy, rarely-modified data.
