---
id: live-003
path: questions/live-coding/live-003.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Spring @Transactional Self-Invocation
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

In a Spring Boot application, the developer expects the `saveData` method to execute within a transaction and rollback if an exception occurs. However, the transaction is not being applied.

**Buggy Code:**

```java
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DataService {

    public void processAndSave() {
        // Some processing logic...
        saveData(); // Calls the transactional method
    }

    @Transactional
    public void saveData() {
        // DB save operations
        // If an exception occurs here, it is supposed to rollback.
        throw new RuntimeException("Simulating DB error");
    }
}
```

### Challenge
Identify why `@Transactional` is not working and refactor the code to fix the issue.

---

### Solution

**Explanation:**
Spring uses AOP proxies to implement `@Transactional`. When a method is called from outside the bean, the call goes through the proxy, which starts the transaction. However, when a method is called from within the same class (self-invocation), the call bypasses the proxy and directly invokes the method on the target object. Therefore, the `@Transactional` annotation is ignored.

**Refactored Code:**
There are several ways to fix this. The cleanest approach is often to move the transactional method to a different service, or inject the service into itself (Self-Injection).

*Approach: Moving to a separate component (Recommended)*

```java
import org.springframework.stereotype.Service;

@Service
public class DataProcessingService {

    private final DataPersistenceService persistenceService;

    public DataProcessingService(DataPersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    public void processAndSave() {
        // Some processing logic...
        persistenceService.saveData(); // Call goes through the proxy
    }
}

@Service
public class DataPersistenceService {

    @Transactional
    public void saveData() {
        // DB save operations
        throw new RuntimeException("Simulating DB error"); // Will rollback now
    }
}
```
