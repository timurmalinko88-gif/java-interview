---
id: spring-019
topic: Spring
difficulty: Middle
format: Open Answer
time: 6
frequency: 80%
source: Custom
prerequisites: ["Spring MVC"]
---

# How do you handle exceptions globally in Spring MVC?
Explain how to implement global exception handling in a Spring application. Which annotations are used?

---ANSWER---

Spring provides a clean, AOP-based way to handle exceptions globally across the entire application without wrapping every controller method in `try-catch` blocks.

This is achieved using the **`@ControllerAdvice`** (or **`@RestControllerAdvice`**) annotation.

**Mechanism:**
1.  You create a centralized class and annotate it with `@ControllerAdvice`.
2.  Inside this class, you write methods to handle specific exceptions.
3.  You annotate these methods with `@ExceptionHandler(SpecificException.class)`.

When any Controller throws an exception, the `DispatcherServlet` intercepts it and looks for a `@ControllerAdvice` class that has an `@ExceptionHandler` matching the thrown exception type.

**@ControllerAdvice vs @RestControllerAdvice:**
-   `@ControllerAdvice`: Methods return a view name to render an error page.
-   `@RestControllerAdvice`: A combination of `@ControllerAdvice` and `@ResponseBody`. Methods return a Java object representing the error details, which Spring automatically serializes into JSON and writes to the response body. (Used for REST APIs).

**Example:**
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUserNotFound(UserNotFoundException ex) {
        return new ErrorResponse("USER_ERROR", ex.getMessage());
    }
}
```

### Life Analogy
Instead of every teacher in a school (Controllers) trying to medically treat a student who gets hurt in class (`try-catch`), they just send the student to the School Nurse (`@ControllerAdvice`). The Nurse has specific treatments (`@ExceptionHandler`) for a scraped knee vs a fever.

### Key Points
- Use `@ControllerAdvice` for global exception handling.
- Use `@ExceptionHandler` on methods to target specific exception classes.
- Use `@RestControllerAdvice` for REST APIs to return JSON error payloads.
- Keeps controller code clean and focused on business logic.
