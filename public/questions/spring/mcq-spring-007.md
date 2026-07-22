---
id: mcq-spring-007
topic: Spring
difficulty: Middle
format: MCQ
tags: [spring-boot, actuator]
---
Зачем используется модуль Spring Boot Actuator?

A. Для генерации swagger документации
B. Для мониторинга и управления приложением (health checks, метрики, логи) в production среде
C. Для горячей перезагрузки контекста (Hot Reloading)
D. Для конфигурации безопасности (Security Configurations)

---ANSWER---
**Правильный ответ: B**

### Key Points
- Actuator предоставляет эндпоинты (например, `/actuator/health`, `/actuator/metrics`), которые полезны для интеграции с системами мониторинга (Prometheus) и оркестраторами (Kubernetes).
