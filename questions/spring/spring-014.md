---
id: spring-014
topic: Spring
difficulty: Senior
format: Open Answer
time: 7
frequency: 65%
source: Custom
prerequisites: ["Spring AOP", "Proxies"]
---

# How does Spring AOP proxying work? (JDK vs CGLIB)
Explain the underlying mechanism of Spring AOP. What is the difference between JDK Dynamic Proxies and CGLIB proxies?

---ANSWER---

Spring AOP implements aspects using the Proxy design pattern. When you ask the Spring container for a bean that is advised by an aspect, Spring does not return the actual target object. Instead, it returns a **Proxy object** that wraps the target. 

This proxy intercepts method calls, executes the associated Advice (before/after/around), and then delegates the call to the real target object.

Spring uses two different types of proxying mechanisms:

**1. JDK Dynamic Proxies (Default for interfaces):**
-   Used if the target object implements at least one interface.
-   Spring creates a proxy class that implements the *same interfaces* as the target class.
-   **Limitation:** It can only proxy methods that are defined in the interface. If you cast the proxy to the concrete class implementation, a `ClassCastException` will be thrown.

**2. CGLIB Proxies (Default for classes):**
-   Used if the target object does *not* implement any interfaces.
-   CGLIB (Code Generation Library) creates a subclass of the target class at runtime and overrides its non-final methods to inject the advice.
-   **Limitation:** It cannot proxy `final` classes or `final` methods, because they cannot be overridden in Java.
-   *Note: In modern Spring Boot, CGLIB proxying is the default even if interfaces are present (via `proxyTargetClass=true`), to prevent `ClassCastException` issues.*

### Life Analogy
-   **JDK Proxy:** An interpreter at the UN. They must adhere to a strict set of predefined conversational rules (the Interface). 
-   **CGLIB Proxy:** A body double in a movie. They look exactly like the actor (Subclass) and perform all the same actions, but they can't perform actions the actor absolutely refuses to let anyone else do (Final methods).

### Key Points
- Spring AOP uses proxies to intercept method calls.
- JDK Proxies are interface-based.
- CGLIB Proxies are class-based (subclassing).
- CGLIB cannot proxy final methods/classes.
