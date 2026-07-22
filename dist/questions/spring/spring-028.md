---
id: spring-028
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Spring Data JPA"]
tags: ['spring-core', 'spring-data']
---

# How do Derived Query Methods work?
Explain the concept of Derived Query Methods (Query Methods by Method Name) in Spring Data JPA. Provide examples.

---ANSWER---

**Derived Query Methods** are a feature of Spring Data where the framework automatically generates a SQL query simply by parsing the *name of the method* you define in your Repository interface. You don't have to write any actual SQL or JPQL.

**How it works:**
Spring Data uses a built-in parser that analyzes the method name based on a specific naming convention.
The method name must start with a subject keyword (like `findBy`, `readBy`, `queryBy`, `countBy`, `deleteBy`).
The rest of the method name describes the criteria, matching the entity's property names, joined by logical operators (`And`, `Or`).

**Examples:**
Assuming an entity `User` with properties `firstName`, `lastName`, and `age`:

-   `List<User> findByLastName(String lastName);`
    -> Generates: `SELECT u FROM User u WHERE u.lastName = ?1`
-   `List<User> findByFirstNameAndAgeGreaterThan(String firstName, int age);`
    -> Generates: `SELECT u FROM User u WHERE u.firstName = ?1 AND u.age > ?2`
-   `List<User> findByLastNameOrderByFirstNameAsc(String lastName);`
    -> Adds a sort clause.

**Limitations:**
While convenient, method names can become incredibly long and unreadable for complex queries (e.g., `findByFirstNameAndLastNameOrAgeLessThanAndIsActiveTrue...`). For complex queries, it is better to use `@Query`.

### Life Analogy
Derived Query Methods are like ordering a custom sandwich at Subway.
You just say the name of the ingredients out loud: "GiveMeASandwichWithHamAndCheeseWithoutMayo." 
The sandwich artist (Spring Data) parses your sentence and automatically builds exactly what you asked for without you having to step into the kitchen.

### Key Points
- Spring generates queries by parsing the method name.
- Starts with keywords like `findBy`, `countBy`.
- Uses entity property names and operators (`And`, `GreaterThan`).
- Great for simple queries; bad for complex ones due to long method names.
