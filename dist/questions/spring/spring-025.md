---
id: spring-025
topic: Spring
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Spring MVC", "Web Concepts"]
tags: ['spring-core', 'spring-mvc']
---

# How do you resolve CORS issues in Spring?
What is CORS? How can you enable and configure CORS in a Spring application?

---ANSWER---

**CORS (Cross-Origin Resource Sharing)** is a browser security feature. By default, web browsers enforce the "Same-Origin Policy," which prevents a frontend running on `http://localhost:3000` from making API requests to a backend running on `http://localhost:8080` (because the port numbers make them different origins). 
The backend must explicitly send HTTP headers (like `Access-Control-Allow-Origin`) to tell the browser it is safe to allow the request.

**How to enable CORS in Spring:**

1.  **Method/Controller Level (`@CrossOrigin`):**
    You can annotate specific Controller classes or methods to allow requests from specific origins.
    ```java
    @RestController
    @CrossOrigin(origins = "http://localhost:3000") // Allows this specific origin
    public class MyController { ... }
    ```

2.  **Global Configuration (`WebMvcConfigurer`):**
    For a centralized approach, you can configure CORS globally by implementing `WebMvcConfigurer` and overriding the `addCorsMappings` method.
    ```java
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://frontend.domain.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
        }
    }
    ```

3.  **Spring Security (If used):**
    If you are using Spring Security, CORS must be configured within the Security Filter Chain, otherwise, the security layer will block the pre-flight `OPTIONS` requests before they reach the MVC configuration.

### Life Analogy
CORS is like a bouncer at an exclusive club (your API).
The Same-Origin Policy means the bouncer only lets in people who live in the exact same building (same origin).
Using `@CrossOrigin` is like handing the bouncer a VIP list. When a request from `localhost:3000` arrives, the bouncer checks the list, sees they are allowed, and lets them in.

### Key Points
- CORS prevents browsers from making cross-origin requests by default.
- Use `@CrossOrigin` for local controller-level configuration.
- Use `WebMvcConfigurer` for global application-level configuration.
- Pre-flight `OPTIONS` requests must be allowed, especially when using Spring Security.
