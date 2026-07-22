---
id: spring-004
topic: Spring
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Spring Beans"]
tags: ['spring-core']
---

# What are the different Bean Scopes in Spring?
Explain the various bean scopes available in the Spring Framework. What is the default scope?

---ANSWER---

A bean scope defines the lifecycle and visibility of a bean instance managed by the Spring container. 

The primary scopes are:

1.  **Singleton (Default):** The container creates only *one* instance of the bean per Spring IoC container. This single instance is shared and returned for all requests for that bean.
2.  **Prototype:** The container creates a *new* instance of the bean every time it is requested.
3.  **Request (Web-aware):** A new instance is created for each HTTP request. It's only valid in the context of a web-aware ApplicationContext.
4.  **Session (Web-aware):** A new instance is created for each HTTP session.
5.  **Application (Web-aware):** A single instance is created for the lifecycle of a `ServletContext`. Similar to singleton, but tied to the web application context.
6.  **WebSocket (Web-aware):** A new instance is created for the lifecycle of a WebSocket.

The default scope is **Singleton**. Because singleton beans are shared, they should generally be stateless to avoid thread-safety issues.

### Life Analogy
-   **Singleton:** A community well. Everyone goes to the same well to get water.
-   **Prototype:** Bottled water. Every time you ask for water, you get a brand new, unopened bottle.
-   **Request:** A single-use paper cup given out for a specific drink order.

### Key Points
- Default scope is Singleton.
- Singleton = one instance per container.
- Prototype = new instance every time.
- Request/Session scopes are specific to web applications.
- Singleton beans must be thread-safe (usually stateless).
