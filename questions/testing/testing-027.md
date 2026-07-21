---
id: testing-027
topic: Testing
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["JUnit 5"]
---

# JUnit 5 assertThrows

How do you test for exceptions in JUnit 5?

---ANSWER---

Use `assertThrows`. It takes the expected Exception class and an executable (lambda) that should throw the exception. It returns the thrown exception, allowing further assertions.

```java
Exception exception = assertThrows(IllegalArgumentException.class, () -> {
    myService.doSomethingBad();
});
```

### Life Analogy
It's like a fire drill. You intentionally trigger the alarm (lambda) and assert that the fire department actually shows up (exception thrown).

### Key Points
- Uses lambdas.
- Returns the exception for further checks.
