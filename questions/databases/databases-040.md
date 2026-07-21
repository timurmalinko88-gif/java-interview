---
id: databases-040
topic: Databases
difficulty: Junior
format: Open Answer
time: 4
frequency: 80%
source: Custom
prerequisites: ["Java", "SQL"]
---

# JDBC vs. ORM (Hibernate).
What are the main differences between using pure JDBC and using an ORM like Hibernate? What are the advantages of ORM?

---ANSWER---

JDBC (Java Database Connectivity) is the low-level standard Java API for connecting to databases. ORM (Object-Relational Mapping) frameworks sit on top of JDBC to simplify development.

**Pure JDBC:**
- You write raw SQL strings directly in your Java code.
- You manually map the returned `ResultSet` columns to Java object properties.
- You must manually handle opening and closing connections, statements, and result sets.
- **Pros:** Maximum performance and control. You can write highly optimized, database-specific SQL.
- **Cons:** Boilerplate-heavy, tedious mapping, prone to SQL injection if not careful, and tightly couples your code to a specific database dialect.

**ORM (Hibernate):**
- You map Java classes to database tables using annotations (`@Entity`, `@Table`).
- You interact with objects, and the ORM automatically generates the SQL statements behind the scenes.
- **Pros:**
    - Massive reduction in boilerplate code.
    - Developer productivity increases (work with objects, not rows).
    - Database independence (the ORM handles dialect translation, e.g., moving from MySQL to Postgres).
    - Built-in caching mechanisms.
- **Cons:** Learning curve, can generate inefficient SQL for very complex queries (the N+1 problem), and abstracts away the database, sometimes hiding performance bottlenecks.

### Life Analogy
Building a house.
- **JDBC:** You buy raw lumber, nails, and cement. You cut every piece of wood yourself and mix the concrete by hand. It gives you absolute custom control over every detail, but it takes forever.
- **ORM:** You buy a pre-fabricated house kit. The walls are already built; you just assemble them. It's much faster and easier, but if you want a bizarre custom roof angle, the kit might not support it easily.

### Key Points
- JDBC is low-level, raw SQL, and requires manual mapping.
- ORM maps objects to tables automatically and generates SQL.
- ORM increases productivity and database portability but can introduce performance overhead if misused.
