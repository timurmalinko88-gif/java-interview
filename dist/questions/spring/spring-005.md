---
id: spring-005
topic: Spring
difficulty: Middle
format: Open Answer
time: 8
frequency: 70%
source: Custom
prerequisites: ["Spring Beans", "IoC Container"]
tags: ['spring-core']
---

# Explain the Spring Bean Lifecycle.
Can you describe the lifecycle of a Spring Bean from instantiation to destruction? How can you hook into this lifecycle?

---ANSWER---

The Spring Bean lifecycle describes how a bean is created, configured, and destroyed by the IoC container.

The simplified flow is:
1.  **Instantiation:** Spring container instantiates the bean (usually via constructor).
2.  **Populate Properties (Dependency Injection):** Spring injects values and dependencies into the bean's properties (setter/field injection).
3.  **Aware Interfaces:** If the bean implements interfaces like `BeanNameAware`, `BeanFactoryAware`, or `ApplicationContextAware`, Spring calls the respective methods to pass container infrastructure to the bean.
4.  **Pre-Initialization (BeanPostProcessor):** Spring calls the `postProcessBeforeInitialization` method of any registered `BeanPostProcessor`s. `@PostConstruct` is handled here.
5.  **Initialization:** Custom initialization logic runs. This is triggered by:
    -   Methods annotated with `@PostConstruct`
    -   `afterPropertiesSet()` method (if implementing `InitializingBean` interface)
    -   Custom `init-method` declared in XML or `@Bean(initMethod="...")`.
6.  **Post-Initialization (BeanPostProcessor):** Spring calls the `postProcessAfterInitialization` method of `BeanPostProcessor`s. This is often where AOP proxies are created.
7.  **Bean is Ready:** The bean is ready for use by the application.
8.  **Destruction:** When the container shuts down, destruction callbacks are invoked:
    -   Methods annotated with `@PreDestroy`
    -   `destroy()` method (if implementing `DisposableBean` interface)
    -   Custom `destroy-method`.

### Life Analogy
Think of onboarding a new employee:
1. **Instantiation:** Signing the contract (hired).
2. **Populate Properties:** Giving them a laptop and badge (dependencies).
3. **Aware:** Telling them the company name and manager (context).
4. **Pre-Init:** Orientation session.
5. **Initialization:** Setting up their local development environment (custom setup).
6. **Post-Init:** Assigning them their first actual ticket.
7. **Ready:** They work.
8. **Destruction:** Exit interview and returning equipment when leaving.

### Key Points
- Instantiation -> DI -> Init -> Ready -> Destroy.
- Best way to hook in is using `@PostConstruct` and `@PreDestroy`.
- `BeanPostProcessor` is powerful for applying logic to beans globally before/after initialization (used for AOP).
