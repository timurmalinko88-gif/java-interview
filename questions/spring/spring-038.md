---
id: spring-038
topic: Spring
difficulty: Junior
format: Open Answer
time: 4
frequency: 60%
source: Custom
prerequisites: ["Spring Security"]
---

# How is the currently authenticated user stored?
How does Spring Security remember who the user is across different methods in the same request? How do you access the current user?

---ANSWER---

Spring Security stores the currently authenticated principal (user) in the **`SecurityContextHolder`**. 

**How it works:**
By default, the `SecurityContextHolder` uses a **`ThreadLocal`** strategy. This means the security context (which contains the `Authentication` object) is bound directly to the current thread executing the request.
Because a typical web request in Spring is handled entirely by a single thread from start to finish, any method called within that request (Controller, Service, Repository) can access the security context without needing to pass the user object around as a method parameter.

**How to access it:**
You can statically access the current user anywhere in your code using:
```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
```

Alternatively, in Spring MVC Controllers, you can have Spring inject it directly into the method signature:
```java
@GetMapping("/profile")
public String getProfile(Principal principal) {
    return "Hello, " + principal.getName();
}
```

### Life Analogy
The `SecurityContextHolder` is like a temporary backpack given to the delivery driver (the Thread) when they start their shift (the HTTP Request).
The driver puts the customer's verified ID (Authentication) in the backpack. No matter which house the driver goes to (Controller, Service), they can just reach into their own backpack to see who they are currently delivering for, without having to call the main office every time. When the shift ends, the backpack is emptied.

### Key Points
- Stored in `SecurityContextHolder`.
- Uses `ThreadLocal` by default (tied to the current request thread).
- Can be accessed statically or injected via method parameters.
- Must be cleared at the end of the request to prevent data leakage in thread pools.
