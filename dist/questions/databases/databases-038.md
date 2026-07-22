---
id: databases-038
topic: Databases
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["JPA", "Hibernate"]
tags: [oop, spring-core, databases, multithreading, spring-data]
---

# Explain the JPA Entity Lifecycle states.
What are the four states an entity can be in during its lifecycle in JPA?

---ANSWER---

An entity instance in JPA transitions through four distinct states managed by the `EntityManager`.

1.  **New (Transient):**
    - The object is newly instantiated using the `new` keyword.
    - It has no association with an `EntityManager`.
    - It has no representation in the database (no row exists yet).
2.  **Managed (Persistent):**
    - The object is associated with an active `EntityManager` (the persistence context).
    - It has a representation in the database (or will have one when the transaction flushes).
    - Any changes made to the object's fields will be automatically synchronized with the database upon commit (Dirty Checking).
    - Achieved via `em.persist(obj)` or by fetching it from the DB via `em.find()`.
3.  **Detached:**
    - The object was previously managed, but the `EntityManager` it was associated with was closed, or `em.detach(obj)` was called.
    - It still has a database row, but changes made to the Java object will *not* be synchronized with the database.
    - It can be re-attached using `em.merge(obj)`.
4.  **Removed:**
    - The object is managed, but it has been scheduled for deletion via `em.remove(obj)`.
    - It is still in the persistence context, but when the transaction commits, the corresponding row will be deleted from the database.

### Life Analogy
Think of a job application.
1. **New:** You just printed your resume. The company doesn't know you exist.
2. **Managed:** You hand your resume to HR. You are now in their system. If you update your phone number with HR, they update their database.
3. **Detached:** The HR office closes for the weekend. You still exist in their database, but if you change your phone number on Sunday, HR won't know about it until you specifically inform them on Monday (Merge).
4. **Removed:** HR flags your file for shredding at the end of the day.

### Key Points
- The four states are New, Managed, Detached, and Removed.
- Managed entities are tracked for changes automatically.
- Detached entities are no longer tracked but can be merged back.
