---
id: spring-036
topic: Spring
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Spring Framework"]
tags: ['spring-core', 'spring-data']
---

# What is Spring Security? What are its core concepts?
Explain what Spring Security is and define its two main conceptual pillars.

---ANSWER---

**Spring Security** is a powerful and highly customizable authentication and access-control framework. It is the de-facto standard for securing Spring-based applications. It focuses on providing both authentication and authorization to Java applications.

Its core concepts revolve around two main pillars:

1.  **Authentication (Who are you?):**
    -   The process of verifying the identity of a user, device, or system.
    -   It usually involves checking credentials like a username and password, an OAuth2 token, or an API key.
    -   If successful, Spring Security establishes a `Principal` (the currently authenticated user) in the `SecurityContext`.

2.  **Authorization / Access Control (What are you allowed to do?):**
    -   The process of determining if an authenticated user has the necessary permissions (roles, authorities) to access a specific resource or perform a specific action.
    -   For example, checking if the current user has the `ROLE_ADMIN` before allowing them to access the `/admin/dashboard` endpoint.

### Life Analogy
Think of an airport.
-   **Authentication:** The TSA agent at the security checkpoint checking your ID and boarding pass to prove you are who you say you are.
-   **Authorization:** The gate agent checking your boarding pass again to ensure you are actually allowed to board *that specific flight*, and whether you are authorized to sit in First Class or Economy.

### Key Points
- Framework for securing Spring applications.
- Authentication = Verifying identity (Who).
- Authorization = Checking permissions (What).
- Secures web endpoints and method invocations.
