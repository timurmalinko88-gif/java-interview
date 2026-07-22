---
id: mcq-spring-005
topic: Spring
difficulty: Middle
format: MCQ
tags: [spring-boot, rest]
---
В чем отличие аннотации @RestController от @Controller в Spring MVC?

A. @RestController возвращает JSON по умолчанию, автоматически добавляя @ResponseBody ко всем методам
B. @RestController используется только для микросервисов
C. @RestController не поддерживает обработку исключений через @ExceptionHandler
D. Разницы нет, это синонимы

---ANSWER---
**Правильный ответ: A**

### Key Points
- `@RestController` является комбинацией `@Controller` и `@ResponseBody`.
- Любые возвращаемые объектом данные будут сериализованы в формат ответа (например, JSON) и записаны напрямую в HTTP Response.
