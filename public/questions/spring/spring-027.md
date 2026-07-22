---
id: spring-027
topic: Spring
difficulty: Junior
format: Open Answer
time: 4
frequency: 80%
source: Custom
prerequisites: ["Spring Data JPA"]
tags: [oop, spring-core, system-design, stream-api, multithreading, collections, spring-data]
---

# CrudRepository vs JpaRepository
What is the difference between `CrudRepository` and `JpaRepository` in Spring Data?

---ANSWER---

Both are interfaces provided by Spring Data to create repository beans, but they belong to different hierarchies and offer different features.

**1. `CrudRepository`:**
-   It is a core Spring Data interface.
-   Provides basic CRUD (Create, Read, Update, Delete) functions.
-   Methods include: `save()`, `findById()`, `findAll()`, `count()`, `delete()`.
-   Returns `Iterable` for methods that return multiple records.

**2. `JpaRepository`:**
-   It is a JPA-specific extension of `PagingAndSortingRepository` (which extends `CrudRepository`).
-   Provides all CRUD operations, plus Paging and Sorting capabilities.
-   Provides JPA-specific methods like:
    -   `flush()`: Forces synchronization of the persistence context to the database.
    -   `saveAndFlush()`: Saves and immediately flushes.
    -   `deleteInBatch()`: Deletes a collection of entities in a single batch query.
-   Returns `List` instead of `Iterable` for methods that return multiple records, making it easier to work with.

**Which to choose:**
Generally, `JpaRepository` is preferred in JPA applications because it provides more features (batch operations, flushing) and returns standard Java `List` collections, even if you only need basic CRUD.

### Life Analogy
-   `CrudRepository` is a basic calculator. It can add, subtract, multiply, and divide.
-   `JpaRepository` is a scientific graphing calculator. It can do everything the basic calculator does, plus it can handle complex matrices (batch operations) and draw graphs (pagination/sorting), and it displays results on a much nicer screen (Returns `List` instead of `Iterable`).

### Key Points
- `JpaRepository` extends `CrudRepository` (indirectly).
- `JpaRepository` adds JPA-specific batch and flush methods.
- `JpaRepository` returns `List`; `CrudRepository` returns `Iterable`.
