---
id: general-033
topic: General
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Core Java", "Keywords", "Exceptions", "Garbage Collection"]
tags: [oop, spring-core, stream-api, jvm, memory, multithreading, collections, exceptions]
---

# final, finally, and finalize

Explain the difference between `final`, `finally`, and `finalize` in Java.

---ANSWER---

While they sound similar, these three keywords/methods serve entirely different purposes in Java.

1. **`final` (Keyword):**
   - **Context:** Used with variables, methods, and classes.
   - **Purpose:** Indicates restriction or immutability.
     - A `final` variable cannot be reassigned (it's a constant).
     - A `final` method cannot be overridden by subclasses.
     - A `final` class cannot be extended (inherited from).

2. **`finally` (Block):**
   - **Context:** Used in conjunction with `try-catch` blocks for exception handling.
   - **Purpose:** Guaranteeing execution. The code inside a `finally` block will almost always execute regardless of whether an exception was thrown or caught in the `try` block. It is primarily used to release resources (like closing files, database connections, or network sockets) to prevent resource leaks.
   - *(Note: It will not execute if `System.exit()` is called, or if the JVM crashes).*

3. **`finalize()` (Method):**
   - **Context:** A method defined in the `java.lang.Object` class.
   - **Purpose:** Garbage collection callback. It is called by the Garbage Collector on an object just before the object is destroyed to reclaim memory. It was originally intended to give objects a chance to clean up non-Java resources.
   - **Status:** It is highly unreliable (you don't know when or if it will run) and has been deprecated since Java 9. Modern Java uses `try-with-resources` or `Cleaner` APIs for resource management instead.

### Life Analogy
- `final` is like putting a padlock on something. A padlock on a box (variable) means you can't swap the contents. A padlock on a blueprint (class) means no one can copy and modify it.
- `finally` is the janitor at a concert venue. Whether the concert finishes beautifully or is cancelled halfway due to a storm (exception), the janitor is always guaranteed to come in and clean up the venue.
- `finalize` is like writing a will. You hope your requests are carried out when you die (are garbage collected), but there is no strict guarantee exactly when the lawyer will read it, making it unreliable.

### Key Points
- `final` applies to variables, methods, and classes to prevent modification/inheritance.
- `finally` is a block used in exception handling to guarantee resource cleanup.
- `finalize()` is an obsolete method on `Object` called before garbage collection; it should no longer be used.
