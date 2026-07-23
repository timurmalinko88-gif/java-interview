---
id: live-010
path: questions/live-coding/live-010.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Custom AOP Annotation @LogExecutionTime
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

You want to measure the execution time of various methods across a Spring Boot application without scattering `System.currentTimeMillis()` everywhere. 

### Challenge
Implement a custom annotation `@LogExecutionTime` and the corresponding Spring AOP Aspect to log the time taken by methods annotated with it.

---

### Solution

**Explanation:**
We need to define a runtime retention annotation. Then, we write an Aspect class marked with `@Aspect` and `@Component`. Inside the Aspect, we use an `@Around` advice pointcut targeting methods annotated with our custom annotation. We use `ProceedingJoinPoint` to execute the method and measure the elapsed time.

**Refactored Code:**

**1. Create the Annotation:**
```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
}
```

**2. Create the Aspect:**
```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("@annotation(LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        
        // Execute the actual method
        Object proceed = joinPoint.proceed();
        
        long executionTime = System.currentTimeMillis() - start;
        
        logger.info("{} executed in {} ms", joinPoint.getSignature().toShortString(), executionTime);
        
        return proceed;
    }
}
```

**Usage:**
```java
@Service
public class MyService {
    @LogExecutionTime
    public void serve() throws InterruptedException {
        Thread.sleep(100);
    }
}
```
