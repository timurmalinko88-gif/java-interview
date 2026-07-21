---
id: databases-044
topic: Databases
difficulty: Senior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Hibernate", "JPA Entity Lifecycle"]
---

# Explain Dirty Checking in Hibernate.
How does Hibernate know when to execute an SQL `UPDATE` statement? Explain the concept of Dirty Checking.

---ANSWER---

Dirty Checking is the mechanism Hibernate uses to avoid sending unnecessary SQL `UPDATE` statements to the database.

**How it works:**
1.  When an entity transitions into the **Managed** state (e.g., you load it from the database using `em.find()`), Hibernate takes a snapshot of the entity's state (its property values) and stores it in the Persistence Context.
2.  Your application modifies the entity's properties (e.g., `user.setEmail("new@email.com")`).
3.  At the end of the transaction (during the `flush` phase, just before commit), Hibernate iterates through all the Managed entities in the session.
4.  It compares the *current* state of the Java object against the *snapshot* it took when the object was loaded.
5.  If it detects any differences, the entity is considered "dirty".
6.  Hibernate then automatically generates and executes an SQL `UPDATE` statement containing only the changed columns (or all columns, depending on configuration) for that specific entity.

Because of dirty checking, you **do not** need to explicitly call `em.merge()` or `session.update()` on an entity that is already in the Managed state.

### Life Analogy
Imagine checking into a hotel room (Loaded Entity). The hotel takes a photo of the minibar (Snapshot).
During your stay, you drink a soda (Modify property).
When you check out (Transaction Flush), the hotel compares the current minibar to the photo they took. They see a difference (Dirty Check) and automatically charge your credit card for the soda (SQL Update). You didn't have to go to the front desk and explicitly tell them you drank it.

### Key Points
- Hibernate compares current managed object state against a loaded snapshot.
- Automatically issues SQL UPDATEs for changed properties upon transaction flush.
- Eliminates the need for explicit update calls on managed entities.
