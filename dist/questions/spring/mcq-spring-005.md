---
id: mcq-spring-005
topic: Spring
difficulty: Middle
format: MCQ
tags: ['spring-boot']
---
What is the difference between the @RestController and @Controller annotations in Spring MVC?

A. @RestController returns JSON by default, automatically adding @ResponseBody to all methods
B. @RestController is used only for microservices
C. @RestController does not support exception handling via @ExceptionHandler
D. There is no difference, they are synonyms

---ANSWER---
**Correct answer: A**

### Key Points
- `@RestController` is a combination of `@Controller` and `@ResponseBody`.
- Any data returned by the object will be serialized into the response format (e.g., JSON) and written directly to the HTTP Response.
