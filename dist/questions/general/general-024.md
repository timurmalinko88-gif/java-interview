---
id: general-024
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["Core Java", "Strings", "Memory Management"]
tags: []
---

# Why are Strings immutable in Java?

Explain the concept of String immutability in Java. What are the main benefits of this design choice?

---ANSWER---

In Java, a `String` is immutable, meaning its value cannot be changed once it is created. Any operation that appears to modify a String (like concatenation or substring) actually creates and returns a completely new `String` object.

The main benefits of String immutability are:
1. **String Pool (Memory Efficiency):** Because strings are immutable, the JVM can optimize memory by storing only one copy of each literal string in the String Pool. If strings were mutable, modifying one would unintentionally change all other references pointing to the same literal.
2. **Security:** Strings are widely used for sensitive data like network connections, database URLs, and file paths. Immutability ensures that these values cannot be maliciously altered after validation.
3. **Thread Safety:** Immutable objects are inherently thread-safe. Multiple threads can share a String without the need for synchronization.
4. **Caching Hashcodes:** Strings cache their hashcode upon first calculation. This makes them extremely fast and ideal candidates for keys in `HashMap`s.

### Life Analogy
Think of a printed book. Once it is printed, you cannot change the text on the pages. If you want a version with different text, you have to print a completely new book. The original book remains exactly as it was.

### Key Points
- `String` objects cannot be modified after creation.
- Enables the String Pool for memory efficiency.
- Provides inherent thread safety.
- Secures sensitive parameters (e.g., file paths, URLs).
- Makes `String` ideal for `HashMap` keys due to cached hashcodes.
