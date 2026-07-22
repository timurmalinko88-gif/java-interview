---
id: spring-016
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Spring MVC"]
tags: [spring-core, system-design, patterns, stream-api, spring-mvc, collections, exceptions]
---

# What is the DispatcherServlet in Spring MVC?
Explain the role of the `DispatcherServlet` in the Spring MVC architecture. What design pattern does it implement?

---ANSWER---

The `DispatcherServlet` is the core, central component of the Spring MVC framework. It acts as the **Front Controller** for the web application. 

**Role:**
1.  **Entry Point:** It receives all incoming HTTP requests directed at the application (based on its URL mapping configuration in `web.xml` or via Java config).
2.  **Delegation:** It does not process the business logic itself. Instead, it delegates the request to other components (Handlers/Controllers) to perform the actual work.
3.  **Coordination:** It manages the entire request lifecycle by orchestrating interactions between `HandlerMapping` (to find the right controller), the `Controller` itself, `ViewResolver` (to find the right UI template), and finally returning the HTTP response back to the client.

**Design Pattern:**
It implements the **Front Controller Design Pattern**. In this pattern, a single servlet handles all requests for an application, providing a centralized mechanism for routing, security, and common request processing logic, before dispatching to specific handlers.

### Life Analogy
The `DispatcherServlet` is like the Receptionist at a large office building (Front Controller). 
When you enter, you don't wander around looking for the person you need to meet. You go to the receptionist, tell them what you want, and they look up the directory (HandlerMapping) and direct you to the correct office (Controller).

### Key Points
- Core component of Spring MVC.
- Implements the Front Controller design pattern.
- Receives all incoming HTTP requests.
- Delegates work to HandlerMappings, Controllers, and ViewResolvers.
