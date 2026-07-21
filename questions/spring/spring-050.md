---
id: spring-050
topic: Spring
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Spring Boot"]
---

# Explain Spring Profiles and externalized configuration.
What are Spring Profiles? How do they work in conjunction with `application.properties` or `application.yml` files?

---ANSWER---

**Spring Profiles** provide a way to segregate parts of your application configuration and make them available only in certain environments (e.g., `dev`, `test`, `prod`).

**How they work:**
Instead of having one massive configuration file and manually changing the database URL every time you deploy to production, you can create multiple property files targeted at specific profiles.

1.  **The Default File:** You have a base `application.yml` (or `.properties`). This contains configurations common to all environments.
2.  **Profile-Specific Files:** You create additional files following the naming convention `application-{profile}.yml`.
    -   `application-dev.yml` (e.g., points to `localhost` DB, enables debug logging).
    -   `application-prod.yml` (e.g., points to AWS RDS, sets log level to ERROR).
3.  **Activation:** When starting the application, you tell Spring which profile is currently active. The properties in the active profile's file will *override* any matching properties in the base `application.yml`.

**How to activate a profile:**
-   Command Line Argument: `java -jar app.jar --spring.profiles.active=prod`
-   Environment Variable: `export SPRING_PROFILES_ACTIVE=prod`
-   In the base `application.yml`:
    ```yaml
    spring:
      profiles:
        active: dev
    ```

**`@Profile` Annotation:**
You can also use the `@Profile("dev")` annotation directly on `@Component` or `@Bean` classes. This tells Spring to only load that specific bean into the ApplicationContext if the "dev" profile is active. (Useful for mock services).

### Life Analogy
Profiles are like different sets of clothing in your closet.
Your base `application.yml` is your underwear; you always wear it regardless of the environment.
If the weather environment is `winter` (active profile), you put on your `application-winter.yml` heavy coat. If the environment is `summer`, you put on your `application-summer.yml` swimsuit.

### Key Points
- Profiles allow environment-specific configurations (`dev`, `prod`).
- Use `application-{profile}.yml` for specific settings.
- Profile properties override base properties.
- Use `@Profile` to conditionally load Java beans.
- Activated via CLI, ENV vars, or properties.
