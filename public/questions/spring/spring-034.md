---
id: spring-034
topic: Spring
difficulty: Middle
format: Code Review
time: 5
frequency: 80%
source: Custom
prerequisites: ["@Transactional"]
tags: [oop, spring-core, databases, exceptions, spring-data]
---

# What triggers a rollback in Spring Transactions?
Review the following code. Will the transaction roll back if `UserNotFoundException` (a checked exception) is thrown? How do you control rollback behavior?

```java
@Transactional
public void updateUser(User user) throws Exception {
    userRepository.save(user);
    if (user.getId() == null) {
        throw new Exception("User not valid");
    }
}
```

---ANSWER---

**No, the transaction will NOT roll back in the provided code.**

By default, Spring's declarative transaction management (`@Transactional`) only rolls back on **unchecked exceptions** (subclasses of `RuntimeException` and `Error`). 
It does **not** roll back on checked exceptions (subclasses of `Exception` that are not `RuntimeException`, like `IOException`, `SQLException`, or a generic `Exception` as seen in the code).

**How to control rollback behavior:**
To force a rollback for a checked exception, you must explicitly declare it using the `rollbackFor` attribute on the annotation:

```java
// Now it WILL roll back on the checked Exception
@Transactional(rollbackFor = Exception.class) 
public void updateUser(User user) throws Exception {
    userRepository.save(user);
    throw new Exception("User not valid");
}
```

Conversely, if you want to prevent a rollback on a specific `RuntimeException`, you can use `noRollbackFor`:
```java
@Transactional(noRollbackFor = SpecificRuntimeException.class)
```

### Life Analogy
-   **RuntimeException (Default Rollback):** A catastrophic failure. The house caught on fire during the inspection. The deal is immediately canceled (rolled back).
-   **Checked Exception (No Rollback):** A known, handleable issue. The inspector found a leaky faucet. The contract states this doesn't cancel the whole house purchase unless you explicitly put a clause in the contract saying it should (`rollbackFor`).

### Key Points
- Default rollback occurs ONLY for `RuntimeException` and `Error`.
- Default behavior does NOT roll back for checked `Exception`s.
- Use `rollbackFor = Exception.class` to force rollback on checked exceptions.
- Use `noRollbackFor` to ignore specific runtime exceptions.
