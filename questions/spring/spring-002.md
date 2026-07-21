---
id: spring-002
topic: Spring
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["IoC", "DI"]
---

# What are the different types of Dependency Injection in Spring?
Which types of Dependency Injection does Spring support? Which one is recommended and why?

---ANSWER---

Spring supports three main types of Dependency Injection:

1.  **Constructor Injection:** Dependencies are provided as arguments to the constructor.
2.  **Setter Injection:** Dependencies are provided through setter methods after the bean is instantiated.
3.  **Field Injection:** Dependencies are injected directly into fields using reflection (usually with `@Autowired`).

**Recommended approach:**
**Constructor Injection** is highly recommended for mandatory dependencies. 

Reasons:
-   **Immutability:** Fields can be marked as `final`, ensuring the dependency is not changed after initialization.
-   **Testability:** It's easier to write unit tests because you can instantiate the class using the `new` keyword and pass mock dependencies directly, without needing a Spring container or reflection.
-   **Safety:** It prevents partial initialization. The object cannot be created without all its required dependencies.
-   **Code Smell Detection:** A constructor with too many arguments is a clear indicator that the class is violating the Single Responsibility Principle.

Setter injection can be used for optional dependencies, while Field injection is generally discouraged due to poor testability and tight coupling with the Spring container.

### Life Analogy
-   **Constructor Injection:** Buying a phone that comes with a non-removable battery built-in at the factory. You can't start using the phone without it.
-   **Setter Injection:** Buying a flashlight. You can buy it without batteries, and put them in later to make it work.

### Key Points
- Spring supports Constructor, Setter, and Field injection.
- Constructor injection is best for mandatory dependencies.
- Constructor injection promotes immutability and easier testing.
- Field injection should generally be avoided.
