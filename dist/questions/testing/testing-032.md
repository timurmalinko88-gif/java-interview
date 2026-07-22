---
id: testing-032
topic: Testing
difficulty: Senior
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["Testcontainers"]
tags: ['testing']
---

# Testcontainers GenericContainer

What is a GenericContainer in Testcontainers?

---ANSWER---

`GenericContainer` is a class that allows you to spin up a Docker container from any valid Docker image, even if Testcontainers doesn't have a specialized module for it. You can configure exposed ports, environment variables, and wait strategies.

### Life Analogy
It's a blank rental warehouse. You can put whatever business you want inside it, as long as you provide the blueprints.

### Key Points
- Fallback for unsupported technologies.
- Requires manual configuration.
