---
id: databases-039
topic: Databases
difficulty: Junior
format: Open Answer
time: 4
frequency: 95%
source: Custom
prerequisites: ["JPA", "Hibernate"]
---

# What is the difference between Lazy and Eager loading?
Explain `FetchType.LAZY` vs `FetchType.EAGER` in JPA entity relationships.

---ANSWER---

Fetch types determine *when* related entities are loaded from the database.

1.  **Eager Loading (`FetchType.EAGER`):**
    - When you fetch the parent entity, the JPA provider immediately executes a `JOIN` query (or a secondary select) to fetch all the related child entities at the exact same time.
    - **Pros:** The data is immediately available. No risk of `LazyInitializationException` if the session closes.
    - **Cons:** Can lead to massive performance issues if the graph of related entities is huge. You might load thousands of rows you don't actually need.
    - *Default for:* `@ManyToOne` and `@OneToOne`.

2.  **Lazy Loading (`FetchType.LAZY`):**
    - When you fetch the parent entity, the JPA provider does *not* fetch the related children. Instead, it places a "proxy" object in the child property.
    - The database query to fetch the children is only executed later, at the exact moment you call a method on the child collection (e.g., `parent.getChildren().size()`).
    - **Pros:** Better performance and lower memory usage initially, as you only load what you need.
    - **Cons:** If you try to access the lazy collection after the `EntityManager` is closed, you will get a `LazyInitializationException`.
    - *Default for:* `@OneToMany` and `@ManyToMany`.

### Life Analogy
You order a laptop online.
- **Eager Loading:** The company ships the laptop, a mouse, a keyboard, a monitor, and a printer all in one giant box, assuming you want everything immediately. (Heavy and expensive delivery).
- **Lazy Loading:** They ship just the laptop. Inside the box is a catalog (the Proxy). You use the laptop, and if you later decide you need a mouse, you call the number in the catalog, and they ship the mouse in a second delivery. (Lighter initial delivery, but causes a delay later if you actually need the mouse).

### Key Points
- Eager fetches related data immediately.
- Lazy delays fetching related data until it is explicitly accessed.
- Lazy is generally preferred for performance, especially on collections.
