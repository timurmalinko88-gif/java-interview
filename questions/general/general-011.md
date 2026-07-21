---
id: general-011
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Core Java", "Keywords"]
---

# Final, Finally, and Finalize

Explain the differences between `final`, `finally`, and `finalize` in Java.

---ANSWER---

These three terms sound similar but serve entirely different purposes in Java.

**1. `final` (Keyword):**
Used to apply restrictions on class, method, or variable.
- **Variable:** A `final` variable's value cannot be changed once initialized (it becomes a constant).
- **Method:** A `final` method cannot be overridden by subclasses.
- **Class:** A `final` class cannot be inherited (e.g., `String` is a final class).

**2. `finally` (Block):**
Used in exception handling alongside `try` and `catch`.
- The `finally` block always executes, regardless of whether an exception was thrown or caught in the `try` block.
- It is primarily used to close resources like database connections, streams, or files to prevent resource leaks. *(Note: try-with-resources in Java 7+ often replaces the need for explicit finally blocks).*

**3. `finalize` (Method):**
A method belonging to the `Object` class.
- It is called by the Garbage Collector immediately before an object is destroyed and its memory reclaimed.
- It was historically used to perform cleanup operations on unmanaged resources.
- **Important:** `finalize()` is highly unpredictable, impacts performance negatively, and is **deprecated since Java 9**. Developers should use `AutoCloseable` or `java.lang.ref.Cleaner` instead.

### Life Analogy
- **`final`** is like pouring concrete. Once it sets, the shape cannot be changed (constant variable, locked class).
- **`finally`** is the closing manager at a store. No matter how chaotic the day was (exceptions thrown) or how peaceful (no exceptions), the manager *always* locks the doors and turns off the lights before leaving (cleaning up resources).
- **`finalize`** is writing your last will. You hope the authorities execute it right before you are buried (garbage collected), but the timing is completely out of your control, making it unreliable.

### Key Points
- `final` is a modifier for immutability and preventing inheritance/overriding.
- `finally` is a block for guaranteed resource cleanup in exception handling.
- `finalize` is an unreliable, deprecated garbage collection callback method.
