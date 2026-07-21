---
id: spring-015
topic: Spring
difficulty: Senior
format: Code Review
time: 8
frequency: 90%
source: Custom
prerequisites: ["Spring AOP", "Proxies"]
---

# Why does AOP / @Transactional fail in self-invocation?
Review the following code. Why doesn't a new transaction start when `doInternalWork()` is called? How do you fix it?

```java
@Service
public class OrderService {

    public void processOrder() {
        // some logic...
        doInternalWork(); // Transaction fails here!
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void doInternalWork() {
        // save to DB
    }
}
```

---ANSWER---

**Why it fails:**
This is known as the **"Self-Invocation" or "Inner Method Call" problem** in Spring AOP. 
Spring AOP (and thus `@Transactional`, which relies on AOP) works by creating proxies around your beans. When an *external* class calls `processOrder()`, the call goes through the Spring proxy, which can apply the transactional advice.
However, when `processOrder()` calls `doInternalWork()`, it is calling `this.doInternalWork()`. It is calling a method on the *actual target object instance*, completely bypassing the Spring proxy. Because the proxy is bypassed, the `@Transactional` interceptor never runs.

**How to fix it:**
1.  **Refactor (Best Practice):** Move `doInternalWork()` to a completely different `@Service` bean and inject that new service into `OrderService`. This ensures the call goes through the proxy.
2.  **Self-Injection:** Inject the `OrderService` into itself. (Can lead to circular dependency issues in older Spring versions, but works well with setter/field injection or `@Lazy`).
    ```java
    @Autowired @Lazy private OrderService self;
    public void processOrder() { self.doInternalWork(); }
    ```
3.  **ApplicationContext:** Fetch the bean from the context manually (`context.getBean(OrderService.class).doInternalWork()`).
4.  **Use AspectJ:** Switch from Spring AOP proxy weaving to AspectJ compile-time weaving, which does not rely on proxies and handles self-invocation perfectly.

### Life Analogy
You hire a bouncer (Proxy) to check IDs at your front door, but you are already inside the house. If you walk from the kitchen to the living room (Self-invocation), the bouncer at the front door can't check your ID. To get checked, you have to walk outside and come back in through the front door (Self-injection or new class).

### Key Points
- Spring AOP relies on Proxies.
- Calling a method from within the same class bypasses the proxy.
- Bypassing the proxy means AOP annotations (`@Transactional`, `@Async`, `@Cacheable`) are ignored.
- Fix by moving logic to a different bean or self-injecting.
