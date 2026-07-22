---
id: spring-018
topic: Spring
difficulty: Junior
format: Open Answer
time: 4
frequency: 95%
source: Custom
prerequisites: ["Spring MVC"]
tags: ['spring-core', 'spring-mvc']
---

# @Controller vs @RestController
What is the difference between `@Controller` and `@RestController` in Spring?

---ANSWER---

Both annotations mark a class as a Spring web controller, but they handle the HTTP response differently.

**`@Controller`:**
-   Used for traditional Spring MVC applications that render web pages (HTML, JSP, Thymeleaf).
-   When a method in a `@Controller` returns a String, Spring interprets it as a **logical view name**. It passes this name to a `ViewResolver` to find and render an HTML template.
-   If you want a specific method in a `@Controller` to return raw data (like JSON) instead of a view, you must explicitly annotate that specific method with `@ResponseBody`.

**`@RestController`:**
-   Used for building RESTful web services that return data (JSON, XML).
-   It is a convenience annotation that combines `@Controller` and `@ResponseBody`. 
    ```java
    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @Controller
    @ResponseBody
    public @interface RestController { ... }
    ```
-   When a method in a `@RestController` returns an object, Spring completely bypasses the `ViewResolver`. It automatically uses `HttpMessageConverters` (like Jackson) to serialize the Java object into JSON/XML and writes it directly to the HTTP response body.

### Life Analogy
-   `@Controller` is a traditional restaurant. When you order, you get a fully plated meal (HTML View). If you just want raw ingredients (JSON), you have to specifically ask for it (`@ResponseBody`).
-   `@RestController` is a wholesale supplier. Whatever you order, you automatically get it in raw, boxed format (JSON data) ready for you to process yourself.

### Key Points
- `@RestController` = `@Controller` + `@ResponseBody`.
- `@Controller` resolves views (HTML).
- `@RestController` returns serialized data (JSON/XML) directly to the response body.
