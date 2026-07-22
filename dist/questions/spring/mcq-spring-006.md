---
id: mcq-spring-006
topic: Spring
difficulty: Senior
format: MCQ
tags: [spring-boot, transaction]
---
Что произойдет, если метод, аннотированный @Transactional, будет вызван из другого метода того же класса (внутри этого же бина)?

A. Транзакция откроется как обычно
B. Транзакция не откроется, так как вызов проходит мимо Spring Proxy
C. Будет выброшено исключение TransactionRequiredException
D. Создастся вложенная транзакция (Propagation.NESTED)

---ANSWER---
**Правильный ответ: B**

### Key Points
- Внутриклассовые вызовы обходят прокси-объект, поэтому AOP-перехватчик Spring не срабатывает. Аннотация `@Transactional` (а также `@Async`, `@Cacheable`) будет проигнорирована.
