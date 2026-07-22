---
id: databases-019
topic: Databases
difficulty: Middle
format: Open Answer
time: 4
frequency: 75%
source: Custom
prerequisites: ["SQL"]
tags: [databases, spring-core, collections]
---

# What is a View in SQL?
Explain what a View is, its advantages, and the difference between a standard View and a Materialized View.

---ANSWER---

A View is a virtual table based on the result-set of an SQL statement. It contains rows and columns, just like a real table, but it doesn't store the data itself (in its standard form). It simply stores the underlying query. Every time you query the view, the database engine runs the underlying SQL query to generate the data on the fly.

**Advantages:**
1.  **Security/Access Control:** You can restrict users to access only the View, hiding sensitive columns or rows of the underlying base tables.
2.  **Simplicity:** You can hide complex queries (involving multiple joins and aggregations) behind a simple View name. Users can just `SELECT * FROM simple_view`.
3.  **Abstraction:** If underlying table structures change, you can often update the View definition without having to change the applications that query the View.

**Standard View vs. Materialized View:**
- **Standard View:** Virtual. Computes data on the fly every time it is queried. Always up-to-date, but can be slow if the underlying query is complex.
- **Materialized View:** Physical. It actually executes the query and stores the results physically on disk. Subsequent queries are very fast because they read the pre-computed data. The trade-off is that the data becomes stale and the materialized view must be refreshed (re-run) periodically to sync with the base tables.

### Life Analogy
- **Standard View:** A live security camera feed on a monitor. The monitor doesn't store the video; it just shows you exactly what the camera is seeing right now.
- **Materialized View:** A photograph taken by the security camera. It's very fast to look at the photo, but it only shows you what was happening at the exact moment the photo was taken, not what is happening right now.

### Key Points
- A View is a saved SQL query that acts like a virtual table.
- It provides security, simplification, and abstraction.
- Standard views compute on the fly; Materialized views store data physically for performance but require refreshing.
