---
id: general-049
topic: General
difficulty: Middle
format: Code Review
time: 5
frequency: 80%
source: Custom
prerequisites: ["Core Java", "Enums"]
---

# Review Enum Instantiation
Review the following code snippet. Can you spot any compilation errors or bad practices? How would you correct them?

```java
public enum Status {
    NEW(1), IN_PROGRESS(2), DONE(3);

    private int code;

    public Status(int code) {
        this.code = code;
    }

    public void setCode(int code) {
        this.code = code;
    }
}
```

---ANSWER---

**Code Review Findings:**

1.  **Compilation Error - Constructor Visibility:** In Java, Enum constructors cannot be `public` or `protected`. They must be `private` (or package-private, which defaults to `private` in an enum context). Enums are designed to have a fixed set of instances defined at compile-time. Allowing public constructors would imply that external code could create new instances of the enum, breaking the fundamental contract of an enum.
2.  **Design Flaw - Mutability:** The enum has a `setCode` method, making the enum instances mutable. Enum instances are essentially global singletons. Modifying the state of an enum instance affects the entire application, which can lead to unpredictable behavior and severe thread-safety issues. Enum fields should almost always be `final`.

**How to Fix:**

Make the constructor private (or remove the modifier) and make the fields `final` to ensure immutability.

```java
public enum Status {
    NEW(1), IN_PROGRESS(2), DONE(3);

    private final int code; // Make it final

    // Constructor must be private (modifier is optional but implied)
    private Status(int code) {
        this.code = code;
    }

    // Provide only a getter, remove the setter
    public int getCode() {
        return code;
    }
}
```

### Life Analogy
An Enum is like the cast of a play where the actors are predefined (e.g., Romeo, Juliet). Having a `public` constructor is like allowing the audience to add random new characters in the middle of the show. Having a mutable state (like `setCode`) is like allowing one scene to permanently change Romeo's costume for the rest of the play, confusing everyone else. 

### Key Points
- Enum constructors must be `private` to prevent external instantiation.
- Enum instances are singletons; therefore, their internal state should be immutable.
- Always mark enum fields as `final` and provide only getters, never setters.
