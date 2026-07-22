---
id: mcq-spring-008
topic: Spring
difficulty: Junior
format: MCQ
tags: ['spring-boot']
---
Which Spring Data JPA interface is used for basic CRUD operations and pagination if you want to inherit all default methods?

A. CrudRepository
B. JpaRepository
C. PagingAndSortingRepository
D. JpaRepository and CrudRepository

---ANSWER---
**Correct answer: B (JpaRepository)**

### Key Points
- `JpaRepository` extends `PagingAndSortingRepository` and `CrudRepository`, and also provides JPA-specific methods (such as `flush`, `saveAll`, etc.).
