---
id: live-003
path: questions/live-coding/live-003.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Spring @Transactional self-invocation
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

# Spring @Transactional self-invocation
In our Spring Boot application, we have a `UserService` with a method `processUsers()` that iterates over a list of users and calls `updateUser()` for each one. The `updateUser()` method is annotated with `@Transactional`. However, when an exception is thrown inside `updateUser()`, the transaction is not rolled back. 

Can you explain why the `@Transactional` annotation is being ignored and how to fix this issue?

---ANSWER---

The issue is caused by the "self-invocation" proxy problem in Spring AOP. Spring's declarative transaction management uses AOP proxies around your beans. When an external caller invokes a method on the `UserService` bean, it goes through the proxy, which starts the transaction.

However, when `processUsers()` (a method inside `UserService`) calls `updateUser()` (another method inside the *same* class), it uses the internal `this` reference. This call bypasses the Spring proxy completely, meaning the transaction interceptor is never triggered. Therefore, `updateUser()` executes without a transactional context, and no rollback occurs upon failure.

To fix this, you have a few options:
1. Move the `@Transactional` method to a separate service class and inject it.
2. Annotate the outer method (`processUsers()`) with `@Transactional` instead, if they should share a single transaction.
3. Use `AopContext.currentProxy()` to self-inject the proxy, though this is generally considered an anti-pattern.
4. Self-inject the service via `@Autowired UserService self;` and call `self.updateUser()`. (Option 1 is highly preferred for cleaner design).

### Examples
```java
// BUGGY CODE:
@Service
public class UserService {
    public void processUsers(List<User> users) {
        for (User u : users) {
            updateUser(u); // Bypasses proxy!
        }
    }

    @Transactional
    public void updateUser(User user) {
        // DB update logic
    }
}

// REFACTORED CODE (Extract to separate service):
@Service
public class UserBatchService {
    private final UserService userService;

    public void processUsers(List<User> users) {
        for (User u : users) {
            userService.updateUser(u); // Now goes through proxy!
        }
    }
}

@Service
public class UserService {
    @Transactional
    public void updateUser(User user) {
        // DB update logic
    }
}
```

### Life Analogy
Imagine you have a personal assistant (the Proxy) who logs every phone call you make to the outside world. If you call someone outside the office, the assistant logs it. But if you walk down the hall and talk to a coworker directly (self-invocation), the assistant never knows it happened. To get it logged, you have to formally ask the assistant to pass the message to your coworker.

### Key Points
- Spring AOP proxies only intercept external method calls coming from outside the bean.
- Internal method calls using `this` bypass the proxy and any AOP annotations like `@Transactional`, `@Cacheable`, or `@Async`.
- The cleanest solution is usually to refactor the code to move the transactional boundaries to an external class or the outer calling method.
