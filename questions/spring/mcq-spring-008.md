---
id: mcq-spring-008
topic: Spring
difficulty: Junior
format: MCQ
tags: [spring-boot, jpa]
---
Какой интерфейс Spring Data JPA используется для базовых CRUD операций и пагинации, если вы хотите наследовать все методы по умолчанию?

A. CrudRepository
B. JpaRepository
C. PagingAndSortingRepository
D. JpaRepository и CrudRepository

---ANSWER---
**Правильный ответ: B (JpaRepository)**

### Key Points
- `JpaRepository` расширяет `PagingAndSortingRepository` и `CrudRepository`, а также предоставляет JPA-специфичные методы (такие как `flush`, `saveAll` и т.д.).
