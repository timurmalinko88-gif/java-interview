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

# Custom AOP Annotation @LogExecutionTime
We have several service methods scattered across our application where developers have manually copy-pasted `System.currentTimeMillis()` at the start and end of the methods to log execution time. This clutters the business logic heavily.

Can you refactor this by creating a custom `@LogExecutionTime` annotation and a Spring AOP Aspect to handle the time logging automatically?

---ANSWER---

Cross-cutting concerns like logging, security, and transaction management should not be tangled with business logic. Aspect-Oriented Programming (AOP) allows us to extract these concerns into separate classes called Aspects.

In Spring, we can define an Aspect using `@Aspect` and `@Component`. We can then use the `@Around` advice to intercept method execution. An `@Around` advice gives us full control: we can execute code before the method, proceed with the actual method execution using `ProceedingJoinPoint`, and execute code after it completes.

By combining an `@Around` advice with a custom annotation, we create a clean, reusable declarative mechanism. Any method annotated with `@LogExecutionTime` will automatically be proxied by Spring, and the execution time will be logged without dirtying the business code.

### Examples
```java
// BUGGY CODE (Cluttered business logic):
@Service
public class ReportService {
    public void generateReport() {
        long start = System.currentTimeMillis();
        try {
            // ... actual business logic ...
            Thread.sleep(1000); 
        } catch (InterruptedException e) { }
        long executionTime = System.currentTimeMillis() - start;
        System.out.println("generateReport executed in " + executionTime + "ms");
    }
}

// REFACTORED CODE:
// 1. Create the Annotation
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
}

// 2. Create the Aspect
@Aspect
@Component
public class LoggingAspect {

    @Around("@annotation(LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        // Proceed with actual method execution
        Object proceed = joinPoint.proceed();

        long executionTime = System.currentTimeMillis() - start;
        
        System.out.println(joinPoint.getSignature().getName() + " executed in " + executionTime + "ms");
        
        return proceed;
    }
}

// 3. Clean Business Logic
@Service
public class ReportService {
    
    @LogExecutionTime
    public void generateReport() {
        // ... purely business logic ...
    }
}
```

### Life Analogy
Imagine working at a factory assembly line. Originally, every worker had to start a stopwatch, do their job, stop the stopwatch, and write down the time. It distracted them from assembling parts. 
AOP is like hiring a dedicated timekeeper who stands beside the conveyor belt with a clipboard. Now, the workers just assemble the parts (business logic), and the timekeeper automatically records how long they took (cross-cutting concern).

### Key Points
- AOP is ideal for separating cross-cutting concerns from core business logic.
- `@Around` advice is the most powerful AOP advice, allowing you to wrap a method call completely.
- `joinPoint.proceed()` must be called in an `@Around` advice to trigger the actual target method.
