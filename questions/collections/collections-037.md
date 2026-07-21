---
id: collections-037
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Interfaces"]
---

# Collection vs Collections
What is the difference between `Collection` and `Collections` in Java?

---ANSWER---

Though they differ by only one letter, they serve completely different roles in the Java Collections Framework.

1. **`java.util.Collection`**:
   - This is the **root interface** of the collections hierarchy (along with `Map`). 
   - Interfaces like `List`, `Set`, and `Queue` extend `Collection`. 
   - It defines standard methods that all collections must have, such as `add()`, `remove()`, `size()`, `iterator()`, etc.
   - You cannot instantiate it directly; you implement it.

2. **`java.util.Collections`**:
   - This is a **utility class** consisting entirely of static methods that operate on or return collections.
   - It contains algorithms for sorting (`Collections.sort()`), searching (`Collections.binarySearch()`), shuffling (`Collections.shuffle()`), and wrapping collections to make them thread-safe (`Collections.synchronizedList()`) or read-only (`Collections.unmodifiableSet()`).
   - You cannot instantiate it (its constructor is private); you just call its static methods.

### Life Analogy
`Collection` is the blueprint or concept of a "Vehicle". It dictates that everything implementing it must have a way to `steer()` and `brake()`. `Collections` is the "Mechanic Shop"—a set of external tools and services (tire rotation, paint job) that you can apply to any Vehicle you bring in.

### Key Points
- `Collection` is a root interface.
- `Collections` is a utility class with static methods.
