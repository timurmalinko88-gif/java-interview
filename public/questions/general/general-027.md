---
id: general-027
topic: General
difficulty: Junior
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Core Java", "Static", "Final"]
tags: ['exceptions']
---

# Static and Final Variables

Analyze the following code snippet. Will it compile? If not, why?

```java
public class Counter {
    public final int count;
    public static int total;

    public Counter() {
        total++;
    }

    public void increment() {
        count++;
        total++;
    }
}
```

---ANSWER---

No, the code will **not** compile. There are two distinct compilation errors related to the `final` keyword.

1. **Uninitialized `final` variable:** The variable `count` is declared as `final` but is not initialized at the point of declaration, nor is it initialized in the constructor. A `final` instance variable (often called a blank final variable) must be definitely assigned a value exactly once before the constructor completes.
2. **Modifying a `final` variable:** Inside the `increment()` method, there is an attempt to modify the `final` variable `count` (`count++`). By definition, the value of a `final` variable cannot be changed once it has been initialized.

**Corrected Code (Example):**
If the intent was to have a mutable counter for the instance and a total counter for all instances:
```java
public class Counter {
    public int count = 0; // Removed final
    public static int total = 0;

    public Counter() {
        total++;
    }

    public void increment() {
        count++;
        total++;
    }
}
```

### Life Analogy
A `static` variable is like a shared whiteboard in a classroom; everyone can see and update the same total score (`total`). A `final` variable is like a person's birth date written in pen on their permanent record (`count`); it must be written down when the record is created (the constructor), and it can never be changed afterward.

### Key Points
- `static` members belong to the class, not instances. They are shared across all instances.
- `final` variables must be initialized (either at declaration, in an initialization block, or in the constructor).
- Once a `final` variable is assigned a value, it cannot be reassigned (mutated).
