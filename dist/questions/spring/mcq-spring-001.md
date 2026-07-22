---
id: mcq-spring-001
topic: Spring
difficulty: Junior
format: MCQ
tags: [spring-boot, di]
---
Какая аннотация в Spring Boot используется для автоматического внедрения зависимостей (Dependency Injection)?

A. @InjectDependency
B. @Bean
C. @Autowired
D. @Provide

---ANSWER---
**Правильный ответ: C (@Autowired)**

### Key Points
- `@Autowired` инструктирует IoC контейнер Spring найти и внедрить соответствующий бин.
- Рекомендуется использовать внедрение через конструктор, а не инжект полей (Field Injection).
