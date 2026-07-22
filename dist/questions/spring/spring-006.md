---
id: spring-006
topic: Spring
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Spring Core"]
tags: ['spring-core', 'spring-mvc', 'spring-data']
---

# Explain @Component, @Service, @Repository, and @Controller stereotypes.
What is the difference between `@Component`, `@Service`, `@Repository`, and `@Controller` in Spring? Can they be used interchangeably?

---ANSWER---

All four are **stereotype annotations** used to mark a class as a Spring Bean, meaning they will be automatically detected during component scanning and registered in the Spring ApplicationContext.

-   `@Component`: This is the generic base annotation for any Spring-managed component. 
-   `@Service`: A specialization of `@Component`. It is used to mark classes that hold business logic. Currently, it doesn't provide additional behavior over `@Component`, but it clarifies the role of the class.
-   `@Repository`: A specialization of `@Component` used for Data Access Objects (DAOs). It provides an extra benefit: it automatically translates underlying persistence exceptions (like SQL exceptions) into Spring's unified `DataAccessException` hierarchy.
-   `@Controller`: A specialization of `@Component` used in Spring MVC to mark a class as a web controller handling HTTP requests. It is used alongside `@RequestMapping`.

**Can they be used interchangeably?**
Technically, you could use `@Component` for everything, and Spring would still create the beans. However, they should **not** be used interchangeably. Using the specific stereotypes clarifies the architecture, makes the code self-documenting, and enables specific framework features (like exception translation for `@Repository` or request mapping for `@Controller`).

### Life Analogy
Think of `@Component` as a generic label "Staff".
`@Service` is "Manager", `@Repository` is "Warehouse Worker", and `@Controller` is "Receptionist". They are all staff, but giving them specific titles clarifies their exact job and allows you to give them specific training (like exception translation for warehouse workers).

### Key Points
- All are used for component scanning.
- `@Component` is generic.
- `@Service` is for business logic.
- `@Repository` is for data access and enables exception translation.
- `@Controller` is for web presentation layers.
