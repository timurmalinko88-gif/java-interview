---
id: spring-045
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Spring Boot"]
---

# What is Spring Boot Actuator?
What is the purpose of Spring Boot Actuator? Name a few commonly used endpoints.

---ANSWER---

**Spring Boot Actuator** is a sub-project of Spring Boot that provides production-ready features to help you monitor, manage, and interact with your application when it is pushed to production. 

Instead of writing custom controllers to check if your app is alive or what its configuration is, Actuator automatically exposes operational information about the running application over HTTP (or JMX) endpoints.

**Commonly Used Endpoints:**
-   `/actuator/health`: Checks the health status of the application. It doesn't just check if the app is running; it can also check if the database connection is alive or if disk space is sufficient. (Used by Kubernetes for liveness/readiness probes).
-   `/actuator/info`: Displays arbitrary application info (like git commit hash, build version) configured in properties.
-   `/actuator/metrics`: Shows detailed metrics like JVM memory usage, garbage collection times, and HTTP request timings. (Often scraped by Prometheus).
-   `/actuator/env`: Returns the current environment properties and configuration values.
-   `/actuator/loggers`: Allows you to view and dynamically change the logging level (e.g., from INFO to DEBUG) of your application at runtime without restarting it.

*Security Note:* Because these endpoints expose sensitive internal details, only `/health` and `/info` are exposed over web (HTTP) by default. The others must be explicitly enabled and should be secured via Spring Security.

### Life Analogy
Actuator is like the dashboard on a car.
The engine (Spring Boot) does the driving, but the dashboard (Actuator) tells you how fast you are going (`metrics`), whether the check engine light is on (`health`), and how much gas is in the tank (`env`). It gives the driver (DevOps team) visibility into the internal state of the machine.

### Key Points
- Provides production-ready monitoring and management endpoints.
- `/health` is critical for load balancers and orchestrators (K8s).
- `/metrics` provides JVM and application statistics.
- Most endpoints are disabled by default for security reasons.
