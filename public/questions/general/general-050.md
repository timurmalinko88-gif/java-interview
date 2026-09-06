---
id: general-050
topic: General
difficulty: Middle
format: Open Answer
time: 8
frequency: 85%
source: Verdict Review
prerequisites: ["Generics", "Type Erasure", "Wildcards"]
tags: ['verdict-review', 'generics', 'core']
---

# Generics and Generic Response Wrapper `Resource<T>`

How do you design a robust, type-safe API response wrapper (like `Resource<T>` or `Result<T>`) in Java? What is the problem with using raw types or `Resource<Object>`, and how do invariance and wildcards (`<? extends T>` / `<? super T>`) apply when consuming such resources?

---ANSWER---

Designing a unified response envelope (often called `Resource<T>`, `ApiResponse<T>`, or `Result<T>`) is a standard requirement in production REST services.

### Problem with Raw Types or `Resource<Object>`
If you declare `Resource<Object>` or use the raw type `Resource`, you strip the compiler of type-checking guarantees:
1. **Unchecked Casts:** The consumer must cast `resource.getData()` to the concrete class (e.g., `(UserDto) resource.getData()`), inviting `ClassCastException` at runtime.
2. **Loss of Invariance Protection:** In Java, Generics are **invariant**: `Resource<String>` is **not** a subclass of `Resource<Object>`. Using `Resource<Object>` prevents passing a typed `Resource<UserDto>` where `Resource<Object>` is expected without wildcards.

### Modern Idiomatic Implementation (Java 17+ Sealed Hierarchy)

```java
public sealed interface Resource<T> permits Resource.Success, Resource.Error, Resource.Loading {
    
    record Success<T>(T data, long timestamp) implements Resource<T> {
        public Success(T data) {
            this(data, System.currentTimeMillis());
        }
    }
    
    record Error<T>(String message, int errorCode, Throwable cause) implements Resource<T> {
        public Error(String message, int errorCode) {
            this(message, errorCode, null);
        }
    }
    
    record Loading<T>() implements Resource<T> {}

    static <T> Resource<T> success(T data) {
        return new Success<>(data);
    }
    static <T> Resource<T> error(String message, int code) {
        return new Error<>(message, code);
    }
}
```

### PECS & Wildcards in Consumption
When a service or controller processes a collection or stream of resources:
- **Producer Extends:** If your method only *reads* data from the resource, use `Resource<? extends UserDto>`. This allows passing `Resource<AdminUserDto>`:
  ```java
  public void logUser(Resource<? extends UserDto> userResource) {
      if (userResource instanceof Resource.Success<? extends UserDto> s) {
          System.out.println(s.data().getUsername());
      }
  }
  ```
- **Consumer Super:** If your method *writes* or populates data into a container, use `<? super T>`.

### Key Takeaways
- Always parameterize with `<T>`; avoid raw types or bare `Object`.
- Sealed interfaces + records provide exhaustiveness checking in `switch` pattern matching (Java 21+).
- Generics invariance requires wildcards (`? extends T`) for covariant read-only usage.
