---
id: mcq-spring-006
topic: Spring
difficulty: Senior
format: MCQ
tags: ['spring-boot']
---
What happens if a method annotated with @Transactional is called from another method of the same class (inside the same bean)?

A. The transaction will open as usual
B. The transaction will not open because the call bypasses the Spring Proxy
C. A TransactionRequiredException will be thrown
D. A nested transaction will be created (Propagation.NESTED)

---ANSWER---
**Correct answer: B**

### Key Points
- Intra-class calls bypass the proxy object, so the Spring AOP interceptor is not triggered. The `@Transactional` annotation (as well as `@Async`, `@Cacheable`) will be ignored.
