---
id: general-046
topic: General
difficulty: Middle
format: Code Review
time: 10
frequency: 80%
source: Custom
prerequisites: ["Core Java", "Static", "Final"]
tags: [oop, spring-core, system-design, stream-api, memory, multithreading, collections, exceptions]
---

# Review Static and Final Usage
Review the following code snippet. Are there any compilation errors or design issues regarding the use of `static` and `final` modifiers? How would you fix them?

```java
public class Configuration {
    public final static List<String> ALLOWED_HOSTS = new ArrayList<>();
    
    public Configuration() {
        ALLOWED_HOSTS.add("localhost");
    }

    public static void addHost(String host) {
        ALLOWED_HOSTS.add(host);
    }
}
```

---ANSWER---

**Code Review Findings:**

1.  **No Compilation Errors:** The code compiles successfully. `ALLOWED_HOSTS` is a `final` reference, which means the reference itself cannot be changed to point to a new `ArrayList`. However, the *contents* of the `ArrayList` can still be modified because `final` does not make objects deeply immutable.
2.  **Design Issues:**
    *   **Security/Immutability Flaw:** The intention of a `public final static` field is usually to define a constant. Exposing a mutable collection like `ArrayList` allows any part of the application to add, remove, or clear the list, violating encapsulation and causing potential concurrent modification issues.
    *   **Constructor Modifying Static State:** Adding to a static list inside an instance constructor is a bad practice. Every time a new `Configuration` object is created, "localhost" will be added again, leading to duplicates.

**How to Fix:**

If the list is meant to be a constant:
```java
public class Configuration {
    public static final List<String> ALLOWED_HOSTS = List.of("localhost"); // Java 9+ immutable list
}
```

If the list is meant to be modifiable but encapsulated:
```java
public class Configuration {
    private static final List<String> allowedHosts = new ArrayList<>();
    
    static {
        allowedHosts.add("localhost");
    }

    public static synchronized void addHost(String host) {
        allowedHosts.add(host);
    }
    
    public static List<String> getAllowedHosts() {
        return Collections.unmodifiableList(allowedHosts);
    }
}
```

### Life Analogy
A `final` reference to a list is like a locked treasure chest where you can't replace the chest itself, but the chest has a hole in it so anyone can reach in and take or add coins. To make it truly secure, you need an unmodifiable collection (a sealed chest).

### Key Points
- `final` on a reference variable prevents reassignment, but does not make the referenced object's internal state immutable.
- Avoid exposing mutable collections as `public static final`. Use `List.of()` or `Collections.unmodifiableList()`.
- Do not initialize or modify static fields inside instance constructors. Use static initializer blocks instead.
