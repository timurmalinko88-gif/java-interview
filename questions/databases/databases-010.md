---
id: databases-010
topic: Databases
difficulty: Junior
format: Open Answer
time: 3
frequency: 85%
source: Custom
prerequisites: ["Java", "Hibernate", "JPA"]
---

# What is the difference between JPA and Hibernate?
Explain the relationship and difference between Java Persistence API (JPA) and Hibernate in the Java ecosystem.

---ANSWER---

This is a very common point of confusion for Java beginners. The relationship is similar to the relationship between interfaces and implementations in Java.

1.  **JPA (Jakarta Persistence API, formerly Java Persistence API):**
    - JPA is a **specification**. It is a set of interfaces, annotations, and rules defined by Oracle/Jakarta EE that dictate how Object-Relational Mapping (ORM) should behave in Java.
    - JPA itself does not contain executable code to save data to a database. You cannot use "just JPA."
    - It provides a standardized API (like `EntityManager`, `@Entity`, `@Table`) so developers can write code that isn't tied to a specific vendor.

2.  **Hibernate:**
    - Hibernate is an **implementation** of the JPA specification. It is a concrete software library (a framework) that actually contains the code to connect to a database, generate SQL, and map Java objects to database tables.
    - Hibernate implements all the interfaces defined by JPA.
    - Hibernate existed before JPA was created. When JPA was introduced to standardize ORM in Java, Hibernate adapted to become a JPA provider.
    - Hibernate also has its own native, proprietary API (like `Session`, `SessionFactory`) that offers features beyond what the JPA standard defines.

**Analogy summary:**
JPA is the blueprint; Hibernate is the building.
JPA is the `List` interface; Hibernate is the `ArrayList` implementation.

### Life Analogy
Think of JPA like the concept of an "Electric Vehicle" and the standards it must follow (must have a battery, must plug in, must not use gas).
Hibernate is like a "Tesla Model 3". It is a specific, physical car that fully implements the standards of an Electric Vehicle, but it also has its own proprietary features (like sentry mode or a specific infotainment UI) that aren't required by the general standard.

### Key Points
- JPA is a specification (rules and interfaces).
- Hibernate is an implementation of JPA (the actual code framework).
- You write code using JPA annotations/interfaces, and Hibernate executes it under the hood.
