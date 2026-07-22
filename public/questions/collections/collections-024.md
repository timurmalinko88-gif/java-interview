---
id: collections-024
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Sorting Algorithms"]
tags: [oop, spring-core, stream-api, memory, collections]
---

# Collections.sort vs Arrays.sort
What sorting algorithms do `Collections.sort()` and `Arrays.sort()` use internally?

---ANSWER---

Both `Collections.sort()` and `Arrays.sort()` are used to sort data, but they operate on different data types and historically used different algorithms.

1. **Arrays.sort() for Primitives:**
   - For arrays of primitive types (like `int[]`, `double[]`), `Arrays.sort()` uses a **Dual-Pivot Quicksort**. 
   - Quicksort is highly efficient for primitives and doesn't require extra memory (in-place). It isn't stable, but stability doesn't matter for primitives (one '5' is indistinguishable from another '5').

2. **Collections.sort() and Arrays.sort() for Objects:**
   - `Collections.sort()` works on `List` collections, and `Arrays.sort()` works on object arrays (like `String[]` or `Integer[]`). 
   - Both of these use a variation of Merge Sort called **TimSort**.
   - TimSort is a stable, adaptive, iterative merge sort. Stability is crucial for objects because if you sort employees by age, you want employees with the same age to remain in their original insertion/name order.

Note: `Collections.sort(list)` actually just delegates to `list.sort()`, which turns the list into an array, calls `Arrays.sort()` (TimSort), and rewrites the list.

### Life Analogy
Sorting primitives (Quicksort) is like sorting identical pennies by mint date; it doesn't matter if two 1999 pennies swap places. Sorting objects (TimSort) is like sorting colored folders by date; if two folders have the same date, you absolutely must maintain their original alphabetical color order (stability).

### Key Points
- `Arrays.sort()` for primitives uses Dual-Pivot Quicksort (not stable, fast, O(1) space).
- `Collections.sort()` and `Arrays.sort()` for objects use TimSort (stable, adaptive).
