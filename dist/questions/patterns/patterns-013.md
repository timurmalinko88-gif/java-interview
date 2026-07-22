---
id: patterns-013
topic: Patterns
difficulty: Middle
format: Open Answer
time: 10
frequency: 80%
source: Custom
prerequisites: ["OOP", "Design Patterns"]
tags: ['patterns']
---

# Proxy Pattern vs Decorator Pattern
Explain the Proxy pattern. How is it fundamentally different from the Decorator pattern despite having a very similar structure?

---ANSWER---

The Proxy pattern provides a surrogate or placeholder for another object to control access to it. It can be used for lazy initialization (Virtual Proxy), access control (Protection Proxy), logging, or network communication (Remote Proxy).

While both Proxy and Decorator wrap an object and have the same interface as the wrapped object, their intents are completely different:
- **Proxy**: Controls access to an object. It often manages the lifecycle of the real object itself. The client might not even know it's interacting with a proxy.
- **Decorator**: Adds responsibilities to an object dynamically. The client typically creates the original object and then explicitly wraps it in the decorator to add features.

### Life Analogy
**Proxy**: A celebrity's bodyguard. If you want to talk to the celebrity, you have to go through the bodyguard first, who decides if you get access.
**Decorator**: The celebrity wearing a stylish hat. It's still the same person, just with added flair (behavior).

### Key Points
- Proxy controls access, Decorator adds behavior.
- Proxies often manage the lifecycle of their target.
- Decorators are usually created and applied explicitly by the client.
