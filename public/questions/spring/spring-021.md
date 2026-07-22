---
id: spring-021
topic: Spring
difficulty: Junior
format: Open Answer
time: 4
frequency: 85%
source: Custom
prerequisites: ["Spring MVC"]
tags: ['spring-core', 'spring-mvc']
---

# Explain @RequestBody and @ResponseBody.
What is the purpose of `@RequestBody` and `@ResponseBody` annotations in Spring REST APIs? How do they work?

---ANSWER---

Both annotations deal with the serialization and deserialization of data, acting as the bridge between HTTP messages (JSON/XML) and Java objects.

**1. `@RequestBody`:**
-   **Direction:** Inbound (Request).
-   **Purpose:** It maps the body of the incoming HTTP request to a Java object. 
-   **How it works:** When a client sends a POST/PUT request with a JSON payload, the `DispatcherServlet` looks for a suitable `HttpMessageConverter` (like Jackson for JSON). The converter reads the raw HTTP request body and deserializes it into the Java object specified as the method parameter.
-   **Example:** `public void createUser(@RequestBody UserDto user) { ... }`

**2. `@ResponseBody`:**
-   **Direction:** Outbound (Response).
-   **Purpose:** It indicates that the return value of a Controller method should be written directly to the HTTP response body, rather than being interpreted as a logical view name (HTML template).
-   **How it works:** When the method returns a Java object, the `HttpMessageConverter` serializes that object into the requested format (usually JSON) and writes it to the HTTP response body.
-   *Note: If the class is annotated with `@RestController`, every method inherits `@ResponseBody` implicitly.*

### Life Analogy
-   `@RequestBody` is the translation headset the chef wears. It takes the customer's order written in French (JSON) and translates it into English (Java Object) so the chef can understand it.
-   `@ResponseBody` is the translator at the exit. The chef gives them the English dish description (Java Object), and they translate it back into French (JSON) for the customer.

### Key Points
- `@RequestBody` converts HTTP Request Body -> Java Object.
- `@ResponseBody` converts Java Object -> HTTP Response Body.
- They rely on `HttpMessageConverter` (like Jackson) to do the actual mapping.
