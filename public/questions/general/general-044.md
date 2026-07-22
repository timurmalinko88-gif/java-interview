---
id: general-044
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Core Java", "Exceptions"]
tags: ['exceptions']
---

# Explain the Exception Hierarchy in Java
Can you explain the Exception hierarchy in Java? What is the difference between `Checked` and `Unchecked` exceptions, and when should you use each?

---ANSWER---

In Java, all exception classes are descendants of the `java.lang.Throwable` class. The two main subclasses of `Throwable` are `Error` and `Exception`.

1.  **Error:** Represents serious problems that a reasonable application should not try to catch (e.g., `OutOfMemoryError`, `StackOverflowError`). They are typically thrown by the JVM.
2.  **Exception:** Represents conditions that a reasonable application might want to catch. This is further divided into:
    *   **Checked Exceptions:** Exceptions that subclass `Exception` but not `RuntimeException`. They are checked at compile-time, meaning the compiler forces the programmer to either handle them (using `try-catch`) or declare them in the method signature (using `throws`). Examples: `IOException`, `SQLException`. Use them for recoverable conditions that are outside the program's control (e.g., a missing file).
    *   **Unchecked Exceptions:** Exceptions that subclass `RuntimeException`. They are not checked at compile-time. Examples: `NullPointerException`, `IllegalArgumentException`. Use them for programming errors where recovery is generally not possible or expected.

### Life Analogy
Think of an `Error` as an earthquake destroying the restaurant—you can't just cook around it. A `Checked Exception` is like realizing you are out of tomatoes; you knew this could happen, so you have a backup plan (catch it). An `Unchecked Exception` is like dropping a plate by accident; it's a mistake in execution that shouldn't happen if you were careful.

### Key Points
- `Throwable` is the root class for all exceptions and errors.
- Checked exceptions force handling at compile time and represent recoverable external issues.
- Unchecked exceptions (`RuntimeException`) represent programming flaws and are not enforced by the compiler.
- `Error` represents severe JVM-level issues that applications shouldn't catch.
