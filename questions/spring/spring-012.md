---
id: spring-012
topic: Spring
difficulty: Junior
format: Open Answer
time: 4
frequency: 70%
source: Custom
prerequisites: ["AOP Concepts"]
---

# What are the different types of Advice in Spring AOP?
List and explain the different types of Advice available in Spring AOP.

---ANSWER---

Advice represents the action taken by an aspect at a particular JoinPoint. Spring AOP supports five types of advice:

1.  **`@Before`:** Advice that executes *before* a join point (method execution), but it does not have the ability to prevent execution flow proceeding to the join point (unless it throws an exception).
2.  **`@AfterReturning`:** Advice to be executed *after* a join point completes normally (i.e., if a method returns without throwing an exception).
3.  **`@AfterThrowing`:** Advice to be executed if a method exits by throwing an exception. Useful for global error handling or logging exceptions.
4.  **`@After` (Finally):** Advice to be executed regardless of the means by which a join point exits (normal return or exceptional return). Similar to a `finally` block.
5.  **`@Around`:** The most powerful advice. It surrounds a join point, meaning it executes before and after the method invocation. It can choose whether to proceed to the actual method, modify the arguments passed to the method, or change the return value entirely. It requires calling `ProceedingJoinPoint.proceed()` to execute the underlying method.

### Life Analogy
Imagine going to a movie theater (the method execution):
-   **@Before:** Scanning your ticket before entering the hall.
-   **@AfterReturning:** Receiving a survey email if you stayed until the credits finished.
-   **@AfterThrowing:** Sounding the fire alarm if the projector catches fire.
-   **@After:** Throwing away your trash as you leave, regardless of whether you liked the movie or there was a fire.
-   **@Around:** A VIP guide who greets you, takes you to your seat, watches the movie with you, and then escorts you out, completely controlling the entire experience.

### Key Points
- 5 types: Before, AfterReturning, AfterThrowing, After, Around.
- `@Around` is the most powerful as it can prevent execution or alter returns.
- `@After` runs regardless of success or failure.
