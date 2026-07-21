---
id: spring-020
topic: Spring
difficulty: Junior
format: Open Answer
time: 4
frequency: 90%
source: Custom
prerequisites: ["Spring MVC"]
---

# @RequestParam vs @PathVariable
What is the difference between `@RequestParam` and `@PathVariable` in Spring MVC? Provide examples of URLs for each.

---ANSWER---

Both annotations are used to extract values from an incoming HTTP request URL and bind them to method parameters in a Controller. The difference lies in *where* in the URL the data is located.

**1. `@RequestParam`:**
-   Used to extract values from **query parameters** (the part of the URL after the `?` mark).
-   Best used for filtering, sorting, or optional data.
-   Example URL: `/users/search?name=John&age=30`
-   Code:
    ```java
    @GetMapping("/users/search")
    public String search(@RequestParam("name") String name, @RequestParam(value="age", required=false) Integer age) { ... }
    ```

**2. `@PathVariable`:**
-   Used to extract values from the **URI path itself** (as part of the RESTful routing).
-   Best used for identifying a specific resource (like an ID).
-   Example URL: `/users/123/orders/456`
-   Code:
    ```java
    @GetMapping("/users/{userId}/orders/{orderId}")
    public String getOrder(@PathVariable("userId") Long userId, @PathVariable("orderId") Long orderId) { ... }
    ```

### Life Analogy
Imagine a filing cabinet.
-   `@PathVariable` is the structured location of the file folder: `Cabinet 3 / Drawer 2 / Folder 15`. It identifies the exact resource.
-   `@RequestParam` is applying a filter while looking in the drawer: "Find files in Drawer 2 `?color=red&size=large`".

### Key Points
- `@RequestParam` extracts query string parameters (`?key=value`).
- `@PathVariable` extracts values from the URI path template (`/resource/{id}`).
- Both can be made optional, though `@PathVariable` is usually mandatory for REST routing.
