---
id: general-030
topic: General
difficulty: Middle
format: System Design
time: 15
frequency: 70%
source: Custom
prerequisites: ["Core Java", "Enums", "Design Patterns"]
---

# Designing with Enums

You are building an e-commerce order processing system. Orders can have different statuses (e.g., PENDING, SHIPPED, DELIVERED, CANCELLED). 
Design an approach using Java Enums to represent these statuses. Why is an Enum better than using `public static final int` or String constants for this?

---ANSWER---

Using an `Enum` for order statuses is an excellent choice for a robust system.

```java
public enum OrderStatus {
    PENDING("Awaiting processing", true),
    SHIPPED("On the way", false),
    DELIVERED("Arrived", false),
    CANCELLED("Order aborted", false);

    private final String description;
    private final boolean canCancel;

    OrderStatus(String description, boolean canCancel) {
        this.description = description;
        this.canCancel = canCancel;
    }

    public String getDescription() { return description; }
    public boolean canCancel() { return canCancel; }
}
```

**Why Enums are better than Integer or String constants:**

1. **Type Safety:** If a method expects an `OrderStatus`, passing an integer like `5` or a string like `"ASDF"` will cause a compile-time error. With `int` constants, you could accidentally pass any integer.
2. **Namespace:** Enums provide their own namespace (e.g., `OrderStatus.PENDING`), preventing naming collisions that often happen with global constants.
3. **Behavior and State:** Unlike simple constants, Enums are full-fledged classes in Java. They can have fields, constructors, and methods (as shown in the example, adding `description` and `canCancel` flags directly to the status).
4. **Switch Statements:** Enums work seamlessly in `switch` expressions, making state machine logic highly readable.
5. **Singleton Guarantee:** The JVM guarantees that only one instance of each Enum constant exists, making equality checks using `==` perfectly safe and fast.

### Life Analogy
Using integer constants for statuses is like trying to navigate a hospital using room numbers alone—"Go to room 404". Using an Enum is like having designated signs: "Go to the Cardiology Wing". It’s explicit, you can't accidentally go to "Room -5", and the sign itself can hold extra information like opening hours.

### Key Points
- Enums provide strict compile-time type safety.
- They are full classes that can contain fields, methods, and constructors.
- They are inherently thread-safe and guarantee single instantiation.
- They prevent invalid state assignments (unlike raw ints or Strings).
