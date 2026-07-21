---
id: spring-048
topic: Spring
difficulty: Senior
format: Open Answer
time: 6
frequency: 70%
source: Custom
prerequisites: ["Testing", "Spring Boot"]
---

# What is Test Slicing? (@WebMvcTest, @DataJpaTest)
Explain the concept of "Test Slicing" in Spring Boot. How do `@WebMvcTest` and `@DataJpaTest` differ from `@SpringBootTest`?

---ANSWER---

**Test Slicing** is a technique provided by Spring Boot to solve the performance problem of `@SpringBootTest`. Instead of loading the *entire* application context for every integration test, a test slice only loads the specific "slice" (or layer) of the application you actually want to test.

**1. `@WebMvcTest` (The Web Slice):**
-   Used to test the web layer (Controllers) in isolation.
-   It auto-configures Spring MVC infrastructure (like `DispatcherServlet`, Jackson, Exception Handlers) and scans for `@Controller` and `@RestController` beans.
-   Crucially, it **does NOT load** `@Service` or `@Repository` beans. You must use `@MockBean` to mock out the service layer dependencies of your controller.

**2. `@DataJpaTest` (The Data Slice):**
-   Used to test the persistence layer (Repositories) in isolation.
-   It auto-configures JPA, Hibernate, Spring Data, and an in-memory database (like H2). It scans for `@Repository` interfaces and `@Entity` classes.
-   By default, it wraps every test in a transaction and rolls it back at the end, leaving the database clean.
-   It **does NOT load** `@Controller` or `@Service` beans.

**Benefits:**
Test slices are much faster than `@SpringBootTest` because they load significantly fewer beans and configurations, while still providing a real (but localized) Spring environment.

### Life Analogy
Imagine testing a massive cruise ship.
-   **`@SpringBootTest`:** Launching the entire ship into the ocean just to see if the ovens in the kitchen work.
-   **`@WebMvcTest` (Test Slice):** Detaching just the kitchen module, hooking it up to a generator on land, and testing the ovens. You ignore the engine room and the steering cabin. It's much faster and cheaper to test.

### Key Points
- Test Slicing loads only the necessary beans for a specific layer.
- `@WebMvcTest` tests Controllers; requires `@MockBean` for Services.
- `@DataJpaTest` tests Repositories; auto-configures an in-memory DB and transactions.
- Faster and more focused than full `@SpringBootTest`s.
