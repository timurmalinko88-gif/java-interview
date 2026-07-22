---
id: spring-024
topic: Spring
difficulty: Middle
format: Open Answer
time: 6
frequency: 60%
source: Custom
prerequisites: ["Spring MVC"]
tags: [oop, spring-core, patterns, stream-api, spring-mvc, collections]
---

# What is a Spring MVC Interceptor?
What are HandlerInterceptors in Spring MVC? How do they differ from Servlet Filters?

---ANSWER---

A `HandlerInterceptor` in Spring MVC is an interface that allows you to intercept incoming HTTP requests and outgoing responses. It is used to apply pre-processing and post-processing logic to web requests.

The interface defines three methods:
1.  **`preHandle`:** Executed *before* the request reaches the Controller. If it returns `false`, the execution chain stops, and the request is aborted. (Used for authentication/authorization checks, logging).
2.  **`postHandle`:** Executed *after* the Controller has processed the request, but *before* the View is rendered. (Used to add common attributes to the Model).
3.  **`afterCompletion`:** Executed *after* the View has been rendered and the response is complete. (Used for resource cleanup or performance monitoring).

**Interceptor vs. Servlet Filter:**
-   **Context:** Filters are part of the standard Java EE Servlet API and execute *before* the request even reaches the Spring `DispatcherServlet`. Interceptors are part of the Spring Framework and execute *inside* the Spring context, right before the target Controller.
-   **Scope:** Filters can intercept all requests (static assets, images). Interceptors only intercept requests that are mapped to a Spring Controller.
-   **Bean Access:** Because Interceptors run inside the Spring Context, they can easily autowire other Spring Beans (like services or repositories). Doing this in a Filter is harder (requires `DelegatingFilterProxy`).

### Life Analogy
-   **Servlet Filter:** The Security Checkpoint at the entrance of an airport. It checks everyone (passengers, staff, mail) before they even get into the building.
-   **Spring Interceptor:** The Gate Agent right before you board a specific flight. They only check people who have tickets for that specific flight (Controller), and they can easily access the airline's specific passenger database (Spring Context).

### Key Points
- Interceptors wrap Controller execution (`preHandle`, `postHandle`, `afterCompletion`).
- Used for cross-cutting web concerns (logging, auth, performance).
- Filters execute outside Spring; Interceptors execute inside Spring.
- Interceptors have easy access to Spring Beans.
