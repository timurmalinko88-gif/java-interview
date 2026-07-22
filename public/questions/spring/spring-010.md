---
id: spring-010
topic: Spring
difficulty: Middle
format: Open Answer
time: 6
frequency: 75%
source: Custom
prerequisites: ["Spring Core"]
tags: ['spring-core', 'spring-data', 'spring-boot']
---

# How are properties injected in Spring? (@Value vs @ConfigurationProperties)
Explain the different ways to inject configuration properties (from `application.properties`/`yml`) into Spring beans. Compare `@Value` and `@ConfigurationProperties`.

---ANSWER---

Spring provides two primary ways to inject externalized properties into beans:

**1. `@Value` Annotation:**
-   Injects a single property value directly into a field, constructor argument, or method parameter using Spring Expression Language (SpEL) or property placeholders (e.g., `@Value("${app.timeout}")`).
-   **Pros:** Simple, quick for injecting one or two solitary values.
-   **Cons:** Harder to manage when dealing with many related properties. Doesn't support hierarchical binding or complex object validation easily. Not type-safe until runtime execution.

**2. `@ConfigurationProperties`:**
-   Binds a group of related properties with a common prefix to a dedicated Java Bean (POJO).
-   E.g., properties starting with `app.mail.*` bind to fields in a `MailProperties` class.
-   **Pros:** 
    -   **Strongly typed:** Properties are bound to specific Java types.
    -   **Structured:** Groups related properties together into a single, cohesive object.
    -   **Validation:** Supports JSR-303/Hibernate Validator (e.g., `@NotNull`, `@Min`) to validate configurations on startup.
    -   **IDE Support:** Better autocompletion in `application.yml` if configured correctly.
-   **Cons:** Requires creating an extra class.

**Summary:** Use `@Value` for one-off, isolated properties. Use `@ConfigurationProperties` when you have a cohesive block of hierarchical configuration settings (which is the recommended approach for Spring Boot applications).

### Life Analogy
-   `@Value` is like handing an employee individual sticky notes with specific instructions ("Your password is X", "Your desk number is Y").
-   `@ConfigurationProperties` is like handing the employee a structured "Employee Handbook" document containing all relevant policies logically grouped together.

### Key Points
- `@Value` is for single, flat property injection.
- `@ConfigurationProperties` binds a prefix to a POJO.
- `@ConfigurationProperties` provides type safety, validation, and structured configuration.
- Prefer `@ConfigurationProperties` for complex settings.
