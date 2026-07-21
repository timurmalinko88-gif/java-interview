---
id: general-004
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Core Java", "Exceptions"]
---

# Checked vs Unchecked Exceptions

What is the fundamental difference between checked and unchecked exceptions in Java, and when should you use each?

---ANSWER---

In Java, exceptions are divided into two main categories: **checked** and **unchecked** exceptions.

**Checked Exceptions:**
- They inherit from `java.lang.Exception` (but not `RuntimeException`).
- The compiler forces you to handle them (using a `try-catch` block) or declare them in the method signature (using the `throws` keyword).
- They represent recoverable conditions that are outside the immediate control of the program (e.g., file not found, network failure).

**Unchecked Exceptions:**
- They inherit from `java.lang.RuntimeException`.
- The compiler does not mandate handling or declaring them.
- They typically represent programming errors, logical flaws, or improper use of an API (e.g., `NullPointerException`, `IllegalArgumentException`, `IndexOutOfBoundsException`).

**When to use which?**
- Use a **checked exception** if you expect the caller to reasonably recover from it.
- Use an **unchecked exception** if the condition is a programming error from which the application cannot or should not attempt to recover at runtime.

### Life Analogy
Imagine you are driving a car. A flat tire is a **checked exception**: it's an external event you can anticipate and fix (change the tire) to continue your journey. However, putting diesel fuel into a gasoline engine is an **unchecked exception**: it's a catastrophic logical error that usually means the journey stops entirely.

### Key Points
- Checked exceptions extend `Exception`, unchecked extend `RuntimeException`.
- Checked exceptions are verified at compile-time.
- Unchecked exceptions reflect programming errors.
- Prefer unchecked exceptions for unrecoverable errors to keep method signatures clean.
