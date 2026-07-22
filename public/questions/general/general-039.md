---
id: general-039
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["Strings", "Basics"]
tags: [oop, spring-core, system-design, jvm, memory, multithreading]
---

# String Immutability and the String Pool
Why are `String` objects immutable in Java, and what is the String Pool?

---ANSWER---

**String Immutability:**
In Java, once a `String` object is created, its state (the characters it contains) cannot be changed. If you try to modify it (e.g., using `concat()` or `toUpperCase()`), a completely new `String` object is created in memory.
Strings are immutable for several reasons:
1. **Security:** Strings are widely used for network connections, database URLs, and file paths. Immutability prevents malicious code from altering these values after they have been validated.
2. **Thread Safety:** Because their state cannot change, multiple threads can safely share a single String instance without synchronization.
3. **Caching / Performance:** Immutability enables the String Pool.

**String Pool:**
The String Pool is a special storage area in the Java heap memory. When you create a String using double quotes (e.g., `String s = "Hello";`), the JVM checks the String Pool. If the string already exists, it returns a reference to the pooled instance instead of creating a new object. This saves memory.

### Life Analogy
String Immutability is like a printed photograph. Once it's printed, you can't change it. If you want a version with a mustache drawn on it, you have to make a copy and draw on that. The String Pool is like a library of standard photographs. If ten people need a picture of the Eiffel Tower, the library gives them all a copy of the exact same photo, rather than hiring ten photographers to take ten identical pictures.

### Key Points
- Strings are immutable for security, synchronization, and performance.
- Modifying a String always creates a new object.
- The String Pool caches literal Strings to save heap memory.
