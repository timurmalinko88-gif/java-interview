---
id: general-038
topic: General
difficulty: Middle
format: Code Review
time: 5
frequency: 75%
source: Custom
prerequisites: ["Enums", "Design Patterns"]
---

# Singleton Pattern using Enums
Review the following code implementing a Singleton using an Enum. Why is this considered the best way to implement a Singleton in Java?

```java
public enum DatabaseConnection {
    INSTANCE;
    
    public void connect() {
        System.out.println("Connected to the database.");
    }
}
```

---ANSWER---

Using an `enum` is considered the best practice for implementing the Singleton pattern in Java (as suggested by Joshua Bloch in Effective Java) for several reasons:

1. **Thread Safety:** The JVM guarantees that the initialization of an enum value is thread-safe. You do not need to implement double-checked locking or synchronization explicitly.
2. **Serialization:** Enum singletons provide serialization machinery for free. Standard Singletons require transient fields and a custom `readResolve()` method to prevent creating a new instance during deserialization. Enums handle this automatically.
3. **Reflection Proof:** It is impossible to use Java Reflection to call the private constructor of an enum and create a second instance. With standard classes, someone could use `setAccessible(true)` to instantiate another object.

### Life Analogy
An Enum Singleton is like the President of a country. The constitution (JVM) strictly guarantees there can only be one at any given time, regardless of how many times you vote (threading), read about them in history books (serialization), or try to sneak into the White House (reflection). 

### Key Points
- Enum guarantees single instantiation natively via the JVM.
- Prevents multiple instances being created during Deserialization.
- Prevents multiple instances being created via Reflection.
