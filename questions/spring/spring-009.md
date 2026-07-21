---
id: spring-009
topic: Spring
difficulty: Senior
format: Open Answer
time: 7
frequency: 60%
source: Custom
prerequisites: ["@Bean", "@Configuration"]
tags: [oop, spring-core, patterns]
---

# Explain @Configuration and Full vs Lite @Bean mode.
What is the purpose of `@Configuration`? Explain the difference between declaring `@Bean` methods inside a `@Configuration` class (Full mode) versus a standard `@Component` class (Lite mode).

---ANSWER---

The `@Configuration` annotation indicates that a class declares one or more `@Bean` methods and may be processed by the Spring container to generate bean definitions and service requests for those beans at runtime.

**Full @Bean Mode (inside @Configuration):**
When `@Bean` methods are declared inside a class annotated with `@Configuration`, Spring creates a **CGLIB proxy** of that configuration class. 
This proxy intercepts calls to `@Bean` methods. If a `@Bean` method calls another `@Bean` method within the same class, the proxy ensures that the *already existing bean instance* from the Spring container is returned, rather than executing the method again and creating a new instance. This preserves singleton semantics.

**Lite @Bean Mode (inside @Component):**
You can also declare `@Bean` methods inside standard `@Component` classes (or classes without `@Configuration`). This is called Lite mode.
In this mode, no CGLIB proxy is created. Inter-bean method calls behave as standard Java method calls. If one `@Bean` method calls another, the second method will execute again, returning a *new instance* of the object, completely bypassing the Spring IoC container and violating singleton scope.

### Life Analogy
-   **Full Mode (Proxy):** You ask the supervisor for a "Company Car". The supervisor checks the ledger (Spring Context). If a car is already assigned, they point you to it. 
-   **Lite Mode (No Proxy):** You ask a coworker for a "Company Car". The coworker goes to the factory and builds a brand new car and gives it to you, ignoring the fact that a company car already exists.

### Key Points
- `@Configuration` enables CGLIB proxying.
- In `@Configuration`, inter-bean method calls are intercepted to return the container's singleton instance.
- In `@Component` (Lite mode), inter-bean method calls create new, unmanaged instances.
- Always use `@Configuration` for central configuration classes to ensure correct scoping.
