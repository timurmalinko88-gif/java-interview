---
id: general-015
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Core Java", "Static", "Final"]
tags: [oop, spring-core, memory, multithreading, collections]
---

# What is the difference between static and final variables?
Describe the distinct purposes of the `static` and `final` keywords when applied to variables in Java.

---ANSWER---

The `static` and `final` keywords serve entirely different purposes, although they are often used together to define constants.

**`static` Variable:**
- **Scope:** Belongs to the class rather than any specific instance of the class.
- **Memory Allocation:** Memory is allocated only once when the class is loaded into memory.
- **Usage:** Used for properties that are common to all objects (e.g., a counter for the number of instances created). All instances share the exact same variable.

**`final` Variable:**
- **Modification:** Indicates that the variable's value cannot be changed once it has been initialized. It is a constant.
- **Initialization:** Must be initialized either when declared, in an initialization block, or in the constructor. For object references, the reference cannot change, but the internal state of the object it points to can.

**Combined (`static final`):**
When used together, they create a class-level constant (e.g., `public static final int MAX_USERS = 100;`), meaning there is only one copy of this unchangeable value across the entire application.

### Life Analogy
A `static` variable is like a town clock in the center of the square; everyone in the town (all instances) looks at the exact same clock. A `final` variable is like your birth date; once it's set, it can never be changed, whether it belongs just to you (instance) or to everyone (static).

### Key Points
- `static` means "one per class" (shared by all instances).
- `final` means "unchangeable once initialized" (constant value or reference).
- They are frequently combined to create global constants.
