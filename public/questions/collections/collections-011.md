---
id: collections-011
topic: Collections
difficulty: Middle
format: Code Review
time: 10
frequency: 80%
source: Custom
prerequisites: ["Interfaces"]
tags: ['collections']
---

# Comparable vs Comparator
What is the difference between `Comparable` and `Comparator` interfaces?

---ANSWER---

Both interfaces are used to sort collections of objects, but they serve different purposes:

1. **Comparable**:
   - Represents the "natural ordering" of an object (e.g., numbers in ascending order, strings alphabetically).
   - The class whose objects are being sorted must implement `Comparable<T>`.
   - It provides a single sorting sequence. You override the `compareTo(T o)` method.
   - Example: `Collections.sort(list);` uses Comparable.

2. **Comparator**:
   - Represents custom ordering logic. It is useful when you want to sort objects in multiple ways (e.g., by age, then by name) or when you cannot modify the source code of the class to implement `Comparable`.
   - The class being sorted does NOT need to implement `Comparator`. Instead, you create a separate class or a lambda that implements `Comparator<T>`.
   - You override the `compare(T o1, T o2)` method.
   - Example: `Collections.sort(list, new NameComparator());`

### Life Analogy
`Comparable` is like a person's height—it's an intrinsic part of who they are, and you can always naturally line people up by height. `Comparator` is like a judge at a dog show—the dogs don't know how to judge themselves, the judge (an external entity) applies custom rules to rank them based on coat, obedience, or breed.

### Key Points
- `Comparable` is for natural, default ordering (`compareTo()`).
- `Comparator` is for external, custom ordering (`compare()`).
- `Comparable` modifies the class being sorted; `Comparator` does not.
