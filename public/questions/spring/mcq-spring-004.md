---
id: mcq-spring-004
topic: Spring
difficulty: Senior
format: MCQ
tags: ['spring-boot', 'aop']
---
Как Spring AOP реализует создание прокси-объектов по умолчанию?

A. Путем модификации байт-кода исходных классов (CGLIB)
B. Путем создания динамических прокси JDK, если класс реализует интерфейс
C. Используя паттерн Decorator на этапе компиляции (AspectJ)
D. Через Java Reflection Proxy без кэширования

---ANSWER---
**Правильный ответ: B**

### Key Points
- Если целевой класс реализует хотя бы один интерфейс, используется JDK Dynamic Proxy.
- Если интерфейсов нет, Spring прибегает к генерации подклассов через CGLIB.
