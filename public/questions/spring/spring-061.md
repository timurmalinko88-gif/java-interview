---
id: spring-061
topic: Spring
difficulty: Middle
format: Code Review
time: 10
frequency: 85%
source: Verdict Review
prerequisites: ["Bean Validation", "Spring Web", "@RestControllerAdvice"]
tags: ['verdict-review', 'spring', 'validation']
---

# Code Review: Request DTO Validation with @Valid and Global Exception Handler

Review the following Spring Boot controller and DTO. Identify the bugs related to validation execution and error handling, and explain how to provide clean, structured validation responses to API consumers.

```java
public class OrderRequestDto {
    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotEmpty(message = "Order must contain items")
    private List<OrderItemDto> items; // Spot the bug here!
    
    // getters and setters
}

public class OrderItemDto {
    @NotNull
    private Long productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping
    public ResponseEntity<Void> createOrder(@RequestBody @Valid OrderRequestDto dto) {
        orderService.create(dto);
        return ResponseEntity.ok().build();
    }
}
```

---ANSWER---

### Code Review Findings

1. **Bug: Nested Collection Validation Ignored:**
   - In `OrderRequestDto`, `items` is annotated with `@NotEmpty`, which ensures the list is not empty.
   - **However**, the individual `OrderItemDto` objects inside the list **will NOT be validated**! A client could send `{"productId": null, "quantity": -50}` and the request would pass validation because the `@Valid` annotation is missing on the list elements:
     ```java
     // ❌ Won't validate items inside
     private List<OrderItemDto> items;

     // ✅ Fixed: Validates each nested object
     @NotEmpty(message = "Order must contain items")
     private List<@Valid OrderItemDto> items; // Java 11+ type-use annotation
     // OR
     @Valid
     @NotEmpty
     private List<OrderItemDto> items;
     ```

2. **Missing Global Exception Handler (`MethodArgumentNotValidException`):**
   - Without an explicit `@RestControllerAdvice`, Spring Boot defaults to returning a standard `400 Bad Request` with an overwhelming default payload or stack trace.
   - The API consumer receives no clean map of field names to validation error messages.

### Solution: Global Validation Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("errors", fieldErrors);

        return ResponseEntity.badRequest().body(response);
    }
}
```

### Key Takeaways
- Nested objects and collections require `@Valid` on the field or type parameter (`List<@Valid Item>`) to trigger recursive validation.
- Always implement a `@RestControllerAdvice` capturing `MethodArgumentNotValidException` to return a clear `{ field: "error" }` map.\n