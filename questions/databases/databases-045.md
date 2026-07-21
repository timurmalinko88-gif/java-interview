---
id: databases-045
topic: Databases
difficulty: Middle
format: Open Answer
time: 5
frequency: 65%
source: Custom
prerequisites: ["JPA", "Hibernate"]
---

# Criteria API vs. JPQL.
What is the difference between JPQL and the Criteria API in JPA? When would you choose one over the other?

---ANSWER---

Both are used to write database queries in JPA, but they use different approaches.

1.  **JPQL (Java Persistence Query Language):**
    - **Approach:** String-based querying. It looks very similar to SQL, but it queries against Java Entity classes and their properties, not database tables and columns.
    - **Example:** `SELECT u FROM User u WHERE u.age > 20`
    - **Pros:** Easy to read, write, and understand for anyone who knows SQL. Concise.
    - **Cons:** Prone to runtime errors. If you misspell a property name in the string, the compiler won't catch it; it will crash when the code executes. Difficult to build queries dynamically based on varying search parameters.

2.  **Criteria API:**
    - **Approach:** Object-oriented, programmatic querying. You build the query by creating Java objects representing the clauses (select, where, order by).
    - **Example:**
      ```java
      CriteriaBuilder cb = em.getCriteriaBuilder();
      CriteriaQuery<User> query = cb.createQuery(User.class);
      Root<User> root = query.from(User.class);
      query.select(root).where(cb.gt(root.get("age"), 20));
      ```
    - **Pros:** **Type-safe.** If you use JPA Metamodel generation, typos are caught at compile-time. It is incredibly powerful for building **dynamic queries** (e.g., a search screen with 10 optional filters where you only append `WHERE` clauses if the user provided a value).
    - **Cons:** Very verbose, hard to read, and has a steep learning curve. Simple queries require a lot of boilerplate code.

### Life Analogy
Ordering a sandwich.
- **JPQL:** You write your order on a piece of paper: "I want a turkey sandwich with no mayo." (String). It's quick, but if you misspell "torkey", the chef won't realize it until they try to read it later.
- **Criteria API:** You use a touchscreen kiosk with drop-down menus. You select Category: Meat -> Option: Turkey. (Programmatic). It takes longer to navigate the menus, but it is impossible to make a spelling mistake, and the menu dynamically changes based on your selections.

### Key Points
- JPQL is string-based and concise but prone to runtime errors.
- Criteria API is programmatic, type-safe, and excellent for dynamic queries, but very verbose.
