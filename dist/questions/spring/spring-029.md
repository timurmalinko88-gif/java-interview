---
id: spring-029
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["Spring Data JPA"]
tags: [oop, spring-core, databases, collections, spring-data]
---

# Explain the @Query annotation in Spring Data.
When and how do you use the `@Query` annotation in Spring Data JPA? What is `nativeQuery = true`?

---ANSWER---

The `@Query` annotation is used in Spring Data repository interfaces to explicitly define the query that should be executed when a specific method is called.

**When to use it:**
-   When Derived Query Methods (by method name) become too long and unreadable.
-   When the query is too complex for the method name parser (e.g., complex joins, subqueries, aggregations).
-   When you want to execute database-specific native SQL.

**How to use it:**
By default, the query written inside `@Query` is **JPQL (Java Persistence Query Language)**. JPQL queries operate against the Java Entity classes and their properties, *not* the physical database tables and columns.

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // JPQL using positional parameters
    @Query("SELECT u FROM User u WHERE u.status = ?1")
    List<User> findByStatusCustom(Integer status);
    
    // JPQL using named parameters
    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findByEmailCustom(@Param("email") String email);
}
```

**`nativeQuery = true`:**
If you need to use database-specific features (like Postgres's `JSONB` functions or Oracle hints) that JPQL doesn't understand, you can set `nativeQuery = true`. This tells Spring to execute the string exactly as raw SQL against the underlying database tables.
```java
@Query(value = "SELECT * FROM users_table WHERE is_active = 1", nativeQuery = true)
List<User> findActiveUsersNative();
```

### Life Analogy
-   **Derived Methods:** Ordering off the menu by saying "Burger with Cheese".
-   **@Query (JPQL):** Handing the chef a standardized recipe card. It uses standard cooking terms (Java classes) that any chef can understand, regardless of the kitchen they are in.
-   **@Query(nativeQuery=true):** Handing the chef instructions that say "Turn the dial on the specific brand of oven you have in the back to exactly 400 degrees". It works perfectly in *that* kitchen, but if you move restaurants (change databases), the instructions break.

### Key Points
- `@Query` defines explicit queries for repository methods.
- Default is JPQL (Entity-oriented).
- Use `@Param` to bind method arguments to named parameters in the query.
- `nativeQuery = true` allows raw SQL (Table-oriented) but breaks database portability.
