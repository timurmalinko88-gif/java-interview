---
id: collections-030
topic: Collections
difficulty: Junior
format: Open Answer
time: 2
frequency: 10%
source: Custom
prerequisites: ["Legacy Collections"]
tags: ['collections']
---

# Dictionary Class
What is the `Dictionary` class in Java and should you use it?

---ANSWER---

The `Dictionary` class is an abstract class introduced in JDK 1.0. It represents a key-value mapping structure, similar to the `Map` interface.

**Should you use it?**
No. The `Dictionary` class is completely obsolete and has been considered legacy since the Java Collections Framework was introduced in Java 1.2. 

The official Java documentation explicitly states: *NOTE: This class is obsolete. New implementations should implement the Map interface, rather than extending this class.*

The only notable class in Java that extends `Dictionary` is the legacy `Hashtable`. Modern Java code should always use `Map` implementations like `HashMap` or `ConcurrentHashMap`.

### Life Analogy
Using the `Dictionary` class in modern Java is like trying to connect to the internet using a dial-up 56k modem. Technically, it might still function, but better, faster, and standard alternatives (broadband / `Map` interface) have existed for decades.

### Key Points
- Obsolete abstract class from JDK 1.0.
- Replaced entirely by the `Map` interface in Java 1.2.
- Should never be used in new code.
