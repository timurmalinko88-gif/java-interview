---
id: spring-040
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Spring Security", "AOP"]
tags: [oop, spring-core, patterns, stream-api, memory, multithreading, exceptions]
---

# Explain Method-Level Security (@PreAuthorize).
How does Method-Level Security work in Spring? What is `@PreAuthorize` and how does it differ from URL-level security?

---ANSWER---

While the `SecurityFilterChain` secures web requests based on their URLs (e.g., securing `/admin/**`), **Method-Level Security** allows you to secure individual Java methods, regardless of how they are called (via a web request, a scheduled task, or another internal bean).

**How it works:**
Method security is built on top of **Spring AOP**. When you annotate a method, Spring creates a proxy around that bean. The proxy intercepts the method call, evaluates the security expression, and throws an `AccessDeniedException` if the current user lacks permissions, preventing the method from executing.

**`@PreAuthorize`:**
The most common annotation is `@PreAuthorize`. It evaluates a Spring Expression Language (SpEL) expression *before* the method is invoked.

Examples:
-   `@PreAuthorize("hasRole('ADMIN')")`: Only users with `ROLE_ADMIN` can call this.
-   `@PreAuthorize("hasAuthority('WRITE_PRIVILEGE')")`: Checks for a specific authority.
-   `@PreAuthorize("#userId == authentication.principal.id")`: **Dynamic evaluation**. Ensures the currently logged-in user can only access their *own* data by comparing a method parameter (`#userId`) to the principal's ID.

*(To use this, you must enable it by adding `@EnableMethodSecurity` to a configuration class).*

### Life Analogy
-   **URL Security (FilterChain):** The security guard at the front door of the bank. They check your ID before letting you into the "Manager Area" (the `/admin` URL).
-   **Method Security (@PreAuthorize):** The biometric lock on the actual safe door inside the room. Even if you snuck past the front door guard (or were teleported inside by a scheduled task), you still can't open the safe (execute the method) without the right fingerprints.

### Key Points
- Secures specific Java methods using Spring AOP proxies.
- Independent of web URLs.
- Requires `@EnableMethodSecurity`.
- `@PreAuthorize` uses SpEL for powerful, dynamic access control before method execution.
