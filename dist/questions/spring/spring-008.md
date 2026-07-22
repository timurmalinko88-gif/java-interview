---
id: spring-008
topic: Spring
difficulty: Middle
format: Open Answer
time: 6
frequency: 80%
source: Custom
prerequisites: ["Spring Beans"]
tags: ['spring-core', 'spring-data']
---

# What is the difference between @Bean and @Component?
Both `@Bean` and `@Component` are used to add beans to the Spring context. What are the key differences, and when should you use each?

---ANSWER---

Both annotations register beans in the Spring IoC container, but they are used in entirely different contexts and ways.

**`@Component` (and stereotypes like `@Service`, `@Repository`)**
-   **Where it is used:** Applied at the **class level**.
-   **How it works:** It relies on **Component Scanning** (`@ComponentScan`). Spring automatically scans the classpath, finds classes with this annotation, instantiates them, and registers them.
-   **When to use:** Use it for classes that you write and control. It's the standard, auto-magical way to register your own application classes.

**`@Bean`**
-   **Where it is used:** Applied at the **method level**, strictly inside a `@Configuration` (or `@Component`) class.
-   **How it works:** You write the method that manually instantiates, configures, and returns the object. Spring calls this method and registers the returned object as a bean.
-   **When to use:** 
    -   When you want to register third-party classes from external libraries into your Spring context (since you can't go modify their source code to add `@Component`).
    -   When you need complex, custom initialization logic for a bean before returning it.
    -   When you want to define multiple beans of the same type with different configurations.

### Life Analogy
-   `@Component` is like putting a "Hire Me" badge on a person (class). The recruiter (Spring Scanner) walks around, sees the badge, and automatically hires them.
-   `@Bean` is like the manager (Configuration class) explicitly writing a memo to the HR department saying, "I have assembled this specific tool kit, please add it to the company inventory."

### Key Points
- `@Component` is class-level; relies on auto-scanning.
- `@Bean` is method-level; requires explicit manual instantiation.
- Use `@Component` for your own code.
- Use `@Bean` for 3rd-party library classes or complex instantiations.
