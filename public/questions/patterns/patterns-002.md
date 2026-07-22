---
id: patterns-002
topic: Patterns
difficulty: Middle
format: Code Review
time: 10
frequency: 80%
source: Custom
prerequisites: ["OOP", "Multithreading"]
tags: [oop, spring-core, patterns, memory, multithreading]
---

# Review Double-Checked Locking Singleton
Review the following Singleton implementation. What is wrong with it and how would you fix it?

```java
public class Singleton {
    private static Singleton instance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

---ANSWER---

The provided implementation uses Double-Checked Locking but it is missing the `volatile` keyword on the `instance` variable. 

Without `volatile`, the Java Memory Model might reorder the instructions during the initialization of the `Singleton` object. Another thread might see a non-null `instance` reference before the object's constructor has finished executing, leading to a partially constructed object being used.

To fix it, change the declaration to:
`private static volatile Singleton instance;`

Alternatively, use the Bill Pugh Singleton Implementation (Initialization-on-demand holder idiom) or an Enum Singleton, which are generally safer and cleaner in Java.

### Life Analogy
Imagine a sign on a bathroom door (the lock). Without `volatile`, it's like the sign flipping to "Occupied" before the person is actually ready inside. Someone might barge in expecting a ready bathroom and get an unpleasant surprise.

### Key Points
- Double-checked locking requires the `volatile` keyword.
- Prevents instruction reordering during object creation.
- Enum singletons are often the preferred approach in Java.
