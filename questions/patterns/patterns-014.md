---
id: patterns-014
topic: Patterns
difficulty: Middle
format: System Design
time: 10
frequency: 60%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: [oop, spring-core, system-design, patterns, stream-api, exceptions]
---

# Chain of Responsibility Pattern
How does the Chain of Responsibility pattern work? Give a real-world software example of where this is commonly used.

---ANSWER---

The Chain of Responsibility is a behavioral pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.

It decouples the sender of a request from its receiver, giving multiple objects a chance to handle the request.

A very common real-world software example is the **Filter Chain** in Java Servlets (or Spring Security). When an HTTP request comes in, it passes through a series of filters (authentication, logging, compression). Each filter can either modify the request/response, reject it outright, or pass it along to the next filter in the chain.

### Life Analogy
Calling technical support. First, you get the automated system (Handler 1). If it can't solve your issue, it passes you to a Tier 1 agent (Handler 2). If the issue is too complex, they pass you to a Tier 2 engineer (Handler 3), until someone finally handles the request.

### Key Points
- Passes requests along a chain of potential handlers.
- Decouples sender and receiver.
- Widely used in HTTP request filtering and event handling.
