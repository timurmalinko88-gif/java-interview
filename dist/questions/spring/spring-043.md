---
id: spring-043
topic: Spring
difficulty: Senior
format: Open Answer
time: 8
frequency: 70%
source: Custom
prerequisites: ["Spring Boot", "@SpringBootApplication"]
tags: ['spring-core', 'spring-mvc', 'spring-boot']
---

# How does Spring Boot Auto-configuration work under the hood?
Explain the internal mechanism of Spring Boot Auto-configuration. How does `@EnableAutoConfiguration` actually know what to configure?

---ANSWER---

The magic of Auto-configuration is driven by the `@EnableAutoConfiguration` annotation and a specific file located within Spring Boot's dependency JARs.

**The Mechanism (Spring Boot 3.0+ Standards):**

1.  **The Trigger:** When the application starts, `@EnableAutoConfiguration` (included in `@SpringBootApplication`) acts as the entry trigger.
2.  **Auto-Configuration Imports (`.imports` file):** 
    Spring Boot looks inside its dependency JARs (specifically `spring-boot-autoconfigure.jar`) for the file at:
    `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`
    *(Note: The legacy `META-INF/spring.factories` file was deprecated in Spring Boot 2.7 and removed in Spring Boot 3.0).*
    This file lists fully qualified class names of auto-configuration classes annotated with `@AutoConfiguration` (e.g. `DataSourceAutoConfiguration`, `WebMvcAutoConfiguration`).
3.  **Conditional Evaluation (`@Conditional`):** 
    Auto-configuration classes run conditionally:
    -   `@ConditionalOnClass`: Executes only if specific classes (e.g. `Tomcat.class`) exist on the classpath.
    -   `@ConditionalOnMissingBean`: Executes only if the user has not declared a custom bean of that type.
    -   `@ConditionalOnProperty`: Executes only if specific `application.yml` properties match.


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
