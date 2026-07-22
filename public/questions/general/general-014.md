---
id: general-014
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 95%
source: Custom
prerequisites: ["Core Java", "Strings"]
tags: []
---

# Why is String immutable in Java?
Explain the concept of String immutability in Java. What are the main benefits of making the String class immutable?

---ANSWER---

In Java, a `String` is immutable, meaning its state cannot be modified after it is created. Any operation that appears to modify a `String` actually creates and returns a new `String` object.

The main reasons and benefits for String immutability include:
1. **Security:** Strings are widely used to store sensitive data like network connections, database URLs, usernames, and passwords. Immutability ensures that once a value is passed, it cannot be tampered with by malicious code.
2. **String Pool (Caching):** Java maintains a special memory region called the String Pool. If Strings were mutable, caching them would be impossible because changing the string in one place would affect all other references pointing to the same cached value.
3. **Thread Safety:** Because their state cannot change, Strings are inherently thread-safe and can be shared among multiple threads without synchronization.
4. **Performance:** The hashcode of a String is frequently used (e.g., in `HashMap` or `HashSet`). Immutability allows the `String` class to cache its hashcode, improving performance significantly when used as map keys.

### Life Analogy
Think of a `String` like a carved stone tablet. Once the words are chiseled into it, they cannot be erased or changed. If you need a different message, you have to carve an entirely new tablet.

### Key Points
- `String` objects cannot be modified after creation.
- Enables the use of the String Pool for memory efficiency.
- Inherently thread-safe due to immutability.
- Allows caching of hashcode for faster lookups in hashing collections.
- Provides security for sensitive information.
