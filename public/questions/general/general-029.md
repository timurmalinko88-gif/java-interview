---
id: general-029
topic: General
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Core Java", "Primitives", "Wrapper Classes"]
tags: []
---

# Primitives vs Wrapper Classes

What is the difference between primitives and their Wrapper classes in Java? When should you use one over the other?

---ANSWER---

In Java, **primitives** (like `int`, `boolean`, `double`, `char`) are basic data types. They store raw values directly in memory (usually on the stack). They are not objects, meaning they do not have methods, cannot be `null`, and do not inherit from the `Object` class.

**Wrapper classes** (like `Integer`, `Boolean`, `Double`, `Character`) are object representations of these primitives. They wrap the primitive value in an object, allowing it to be used in places where objects are required (such as in Java Collections).

**When to use which:**
- Use **primitives** for pure numerical operations, tight loops, and when memory footprint and performance are critical. Primitives are faster and take up less memory because they avoid object overhead.
- Use **Wrapper classes** when working with Collections Frameworks (e.g., `List<Integer>`, since Collections can only hold objects), when you need to represent the absence of a value (`null`), or when you need utility methods provided by the wrapper class (e.g., `Integer.parseInt()`).

### Life Analogy
A primitive is like a loose coin in your pocket—simple, fast to use, and taking up almost no space. A Wrapper class is like taking that coin and putting it inside a fancy presentation box. The box adds weight and takes up more room, but now you can put it on display in a museum collection (Java Collections) or attach a label to it (utility methods).

### Key Points
- Primitives (`int`, `boolean`) are fast, memory-efficient raw values.
- Wrapper classes (`Integer`, `Boolean`) are objects containing primitive values.
- Java Collections require objects, hence they require Wrapper classes.
- Primitives have default values (e.g., `0`), while Wrappers can be `null`.
- Java supports autoboxing and unboxing to convert between them automatically.
