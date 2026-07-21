---
id: stream-023
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Optional"]
---

# Optional.of() vs Optional.ofNullable()
What is the difference between `Optional.of(value)` and `Optional.ofNullable(value)`? When should you use each?

---ANSWER---

Both methods are static factory methods used to create an instance of an `Optional` wrapper around a given value. The difference lies in how they handle `null` arguments.

**`Optional.of(value)`:**
- **Behavior:** It strictly expects a non-null value. 
- **Exception:** If you pass `null` to `Optional.of(null)`, it will immediately throw a `NullPointerException`.
- **Use case:** Use this when you are absolutely certain that the value is not null, and if it *is* null, it represents a fatal bug in your logic that you want to catch immediately (Fail-Fast behavior).

**`Optional.ofNullable(value)`:**
- **Behavior:** It is forgiving. If the value is non-null, it behaves exactly like `Optional.of()`. If the value is `null`, it returns an empty Optional (`Optional.empty()`).
- **Exception:** It never throws an exception based on the input.
- **Use case:** Use this when the value you are wrapping might legitimately be null (e.g., retrieving a value from a Map, or calling an older legacy API that might return null).

Example:
```java
String name = "Alice";
String nullName = null;

Optional<String> opt1 = Optional.of(name); // Works fine
Optional<String> opt2 = Optional.ofNullable(nullName); // Works fine, creates Optional.empty()
Optional<String> opt3 = Optional.of(nullName); // THROWS NullPointerException!
```

### Life Analogy
`Optional.of()` is like a strict security guard at a club: "You must have an ID. No ID? You're immediately arrested (Exception)."
`Optional.ofNullable()` is like a relaxed bouncer: "Got an ID? Great, go in. No ID? That's fine, just stand in the 'Empty' waiting room."

### Key Points
- `Optional.of()` throws NPE on null values.
- `Optional.ofNullable()` returns `Optional.empty()` on null values.
- Use `of()` for guaranteed non-nulls; use `ofNullable()` for uncertain values.
