---
id: spring-043
topic: Spring
difficulty: Senior
format: Open Answer
time: 8
frequency: 70%
source: Custom
prerequisites: ["Spring Boot", "@SpringBootApplication"]
---

# How does Spring Boot Auto-configuration work under the hood?
Explain the internal mechanism of Spring Boot Auto-configuration. How does `@EnableAutoConfiguration` actually know what to configure?

---ANSWER---

The magic of Auto-configuration is driven by the `@EnableAutoConfiguration` annotation and a specific file located within Spring Boot's dependency JARs.

**The Mechanism:**

1.  **The Trigger:** When the application starts, `@EnableAutoConfiguration` acts as a trigger.
2.  **`spring.factories` (or `org.springframework.boot.autoconfigure.AutoConfiguration.imports` in Boot 2.7+):** 
    Spring Boot looks inside its own internal JARs (specifically `spring-boot-autoconfigure.jar`) for a file located at `META-INF/spring.factories` (or the newer `.imports` file). This file contains a massive list of fully qualified class names of **Auto-Configuration classes** (e.g., `DataSourceAutoConfiguration`, `WebMvcAutoConfiguration`).
3.  **Conditional Evaluation (`@Conditional`):** 
    Spring Boot doesn't just blindly load all these classes. Every Auto-Configuration class is heavily annotated with `@Conditional` annotations. These act as guard clauses.
    -   `@ConditionalOnClass`: Only run this config if a specific class is present on the classpath (e.g., only configure Tomcat if `Tomcat.class` is found).
    -   `@ConditionalOnMissingBean`: Only run this config if the developer hasn't already defined their own bean of this type (e.g., only configure a default `DataSource` if the user hasn't explicitly created one).
    -   `@ConditionalOnProperty`: Only run this if a specific property in `application.yml` is set.
4.  **Application:** If the conditions pass, the Auto-Configuration class executes and registers its beans into the ApplicationContext.

**In Summary:** It's not "magic." It's a massive, pre-written `if-else` tree checking the classpath and user configurations to decide which default beans to load.

### Life Analogy
Auto-configuration is like a Smart Home setup routine.
The system (Spring Boot) has a massive checklist of possible devices it knows how to configure (`spring.factories`).
It walks through the house and evaluates conditions (`@Conditional`).
"Is there a smart bulb in the socket? (`@ConditionalOnClass`). Yes. Did the owner already set up a custom lighting schedule? (`@ConditionalOnMissingBean`). No. Okay, I will automatically configure the default lighting schedule."

### Key Points
- Relies on `META-INF/spring.factories` (or `.imports`) to find candidate config classes.
- Heavily uses `@Conditional` annotations to determine if a config should be applied.
- "Opinionated defaults" that back off if the user provides their own configuration (`@ConditionalOnMissingBean`).
