---
id: spring-003
topic: Spring
difficulty: Middle
format: Open Answer
time: 7
frequency: 80%
source: Custom
prerequisites: ["IoC Container"]
---

# BeanFactory vs ApplicationContext
What is the difference between `BeanFactory` and `ApplicationContext` in Spring? When should you use which?

---ANSWER---

Both `BeanFactory` and `ApplicationContext` are interfaces representing the Spring IoC container, but `ApplicationContext` is a sub-interface of `BeanFactory` and provides advanced capabilities.

**BeanFactory:**
-   Provides basic IoC and DI features.
-   Uses **lazy initialization**: Beans are created only when they are explicitly requested (via `getBean()`).
-   Lighter and consumes less memory.

**ApplicationContext:**
-   Includes all functionalities of `BeanFactory`.
-   Uses **eager initialization** for singletons: All singleton beans are instantiated at startup.
-   Provides enterprise-specific features like:
    -   Internationalization (i18n) via `MessageSource`.
    -   Event publication (`ApplicationEventPublisher`).
    -   Web application integration (`WebApplicationContext`).
    -   Easier AOP integration.

**When to use which:**
You should almost always use `ApplicationContext` in modern Spring applications because of the rich feature set and early detection of configuration errors (due to eager loading). `BeanFactory` is only useful in extremely memory-constrained environments (like applets or mobile apps in the past), which is rare today.

### Life Analogy
-   `BeanFactory` is like a basic vending machine. The item is only prepared and dispensed when you press the button (lazy).
-   `ApplicationContext` is like a high-end buffet restaurant. Everything is prepared in advance before the doors open (eager), and it offers extra services like background music and waiters (events, i18n).

### Key Points
- `ApplicationContext` extends `BeanFactory`.
- `BeanFactory` is lazy, `ApplicationContext` is eager (for singletons).
- `ApplicationContext` provides enterprise features (i18n, events, AOP).
- Always default to `ApplicationContext`.
