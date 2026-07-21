---
id: spring-022
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["Spring MVC"]
---

# What is ResponseEntity in Spring?
What is `ResponseEntity`? Why would you use it instead of just returning a POJO or `@ResponseBody`?

---ANSWER---

`ResponseEntity` is a class in Spring that represents the entire HTTP response. While returning a simple POJO (with `@ResponseBody`) only allows you to control the *body* of the HTTP response, `ResponseEntity` allows you to control the **Status Code**, **Headers**, and the **Body**.

**Why use it?**
1.  **Status Codes:** REST APIs should return appropriate HTTP status codes to indicate success or failure (e.g., 201 Created, 404 Not Found, 400 Bad Request). Returning a POJO defaults to 200 OK, which isn't always accurate.
2.  **Headers:** You might need to send custom headers back to the client (e.g., a `Location` header after creating a resource, or custom security tokens).

**Example:**
Instead of this:
```java
@PostMapping("/users")
public User createUser(@RequestBody User user) { 
    return service.save(user); // Always returns 200 OK
}
```

You do this:
```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@RequestBody User user) {
    User savedUser = service.save(user);
    HttpHeaders headers = new HttpHeaders();
    headers.add("Custom-Header", "value");
    return new ResponseEntity<>(savedUser, headers, HttpStatus.CREATED); // Returns 201 Created
}
```
*Spring also provides a fluent builder API: `return ResponseEntity.status(HttpStatus.CREATED).headers(headers).body(savedUser);`*

### Life Analogy
Returning a POJO is like handing someone an unlabelled box with their item inside. They got the item, but they don't know who sent it or if it's fragile.
Returning a `ResponseEntity` is like using FedEx. You provide the box (Body), but you also attach a shipping label with priority routing (Headers) and get a tracking receipt (Status Code).

### Key Points
- `ResponseEntity` represents the full HTTP response.
- Use it to customize HTTP Status Codes.
- Use it to add custom HTTP Headers.
- Provides a fluent builder API.
