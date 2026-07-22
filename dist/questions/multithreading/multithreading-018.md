---
id: multithreading-018
topic: Multithreading
difficulty: Senior
format: Code Review
time: 10
frequency: 85%
source: Custom
prerequisites: ["Concurrency", "Singleton", "volatile"]
tags: ['multithreading']
---

# Double-Checked Locking Singleton
Review the following implementation of the Singleton pattern using double-checked locking. What is wrong with it, and how would you fix it?

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

The code is **not thread-safe** because the `instance` variable is not declared as `volatile`.

The problem lies in the statement `instance = new Singleton();`. This is not a single atomic operation; it consists of three steps at the machine level:
1. Allocate memory for the `Singleton` object.
2. Initialize the `Singleton` object (call the constructor).
3. Point the `instance` reference to the allocated memory space.

The Java compiler or the CPU is allowed to reorder steps 2 and 3 for optimization. If reordered, the `instance` variable might point to a memory location before the object is fully initialized. 

If this happens, another thread entering `getInstance()` will see that `instance != null` (the first check outside the synchronized block) and return the partially initialized object, leading to erratic behavior or `NullPointerException`s when using it.

**Fix**: Add the `volatile` keyword to the `instance` declaration:
`private static volatile Singleton instance;`
`volatile` prevents the reordering of read and write instructions, ensuring that the object is fully initialized before the reference is made visible to other threads.

- Object instantiation is not an atomic operation.
- Instruction reordering can expose partially constructed objects.

### Life Analogy
Imagine buying a house. Normally you (1) buy the land, (2) build the house, (3) get the keys (reference). Reordering is like getting the keys after buying the land but before the house is built. If you invite a friend over (another thread), they see you have keys (not null), go to the address, and fall into an empty pit (partially initialized object). `volatile` forces the builder to finish the house before handing over the keys.

### Key Points
- Double-checked locking requires the `volatile` keyword.
