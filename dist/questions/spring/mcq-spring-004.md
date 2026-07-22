---
id: mcq-spring-004
topic: Spring
difficulty: Senior
format: MCQ
tags: ['spring-boot', 'aop']
---
How does Spring AOP implement the creation of proxy objects by default?

A. By modifying the bytecode of the original classes (CGLIB)
B. By creating JDK dynamic proxies if the class implements an interface
C. Using the Decorator pattern at compile time (AspectJ)
D. Through Java Reflection Proxy without caching

---ANSWER---
**Correct answer: B**

### Key Points
- If the target class implements at least one interface, JDK Dynamic Proxy is used.
- If there are no interfaces, Spring resorts to generating subclasses via CGLIB.
