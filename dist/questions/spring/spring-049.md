---
id: spring-049
topic: Spring
difficulty: Senior
format: Code Review
time: 7
frequency: 80%
source: Custom
prerequisites: ["DI", "Spring Core"]
tags: ['spring-core', 'spring-boot']
---

# How to handle Circular Dependencies in Spring?
Review the architecture below. Application startup fails with a `BeanCurrentlyInCreationException`. What is the problem, and what are the best ways to fix it?

```java
@Service
public class OrderService {
    private final PaymentService paymentService;
    public OrderService(PaymentService paymentService) { this.paymentService = paymentService; }
}

@Service
public class PaymentService {
    private final OrderService orderService;
    public PaymentService(OrderService orderService) { this.orderService = orderService; }
}
```

---ANSWER---

**The Problem:**
This is a **Circular Dependency**. `OrderService` needs `PaymentService` to be created first, but `PaymentService` needs `OrderService` to be created first. Because both are using **Constructor Injection**, Spring cannot instantiate either of them, resulting in a deadlock during startup and throwing a `BeanCurrentlyInCreationException`.

*(Note: Spring Boot 2.6+ explicitly forbids circular dependencies by default even if not using constructors).*

**How to fix it:**

1.  **Architectural Redesign (Best Practice):** 
    A circular dependency is almost always a sign of a bad design violating the Single Responsibility Principle. The best fix is to extract the shared logic into a third, independent service (e.g., `OrderPaymentOrchestrator`), and have both original services inject the new orchestrator (or vice versa).
2.  **`@Lazy` Annotation:** 
    You can break the cycle by telling Spring to lazily initialize one of the dependencies.
    ```java
    public OrderService(@Lazy PaymentService paymentService) { ... }
    ```
    Spring will inject a proxy instead of the real `PaymentService` during construction. The real bean is only created and fetched when a method on the proxy is actually called for the first time.
3.  **Setter/Field Injection (Legacy):**
    If you switch from Constructor injection to Setter or Field injection, Spring can instantiate the bare objects first using their default constructors, and then inject the dependencies afterward. *(Not recommended as it sacrifices immutability and hides design flaws).*

### Life Analogy
-   **Circular Dependency:** You need a job to get experience, but you need experience to get a job. You are stuck.
-   **`@Lazy` Fix:** The employer hires you (Constructs the bean) but gives you an "IOU Experience" voucher (Proxy). You only actually need the real experience when you are asked to perform your first difficult task.
-   **Redesign Fix:** You get an internship (Third service) which provides both the initial job and the experience simultaneously.

### Key Points
- Circular dependency: Bean A needs B, B needs A.
- Constructor injection fails immediately on circular dependencies.
- Fix 1 (Best): Redesign the architecture to remove the cycle.
- Fix 2 (Pragmatic): Use `@Lazy` on one of the constructor parameters.
