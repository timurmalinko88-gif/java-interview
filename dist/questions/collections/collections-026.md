---
id: collections-026
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Java 9 Features"]
tags: ['collections']
---

# Immutable Collections (Java 9+)
How do you create truly immutable collections in Java, and how do they differ from unmodifiable collections?

---ANSWER---

Java 9 introduced convenient factory methods to create truly immutable collections: `List.of()`, `Set.of()`, and `Map.of()`.

**How they differ from `Collections.unmodifiableList()`:**
1. **True Immutability**: `Collections.unmodifiableList()` creates a wrapper view around an existing collection. If the underlying collection changes, the view changes. `List.of()` creates a structurally immutable collection from the start. Once created, its contents can never change.
2. **Nulls**: `List.of()`, `Set.of()`, and `Map.of()` strictly forbid `null` elements. Attempting to add `null` throws a `NullPointerException`. Older collections often allowed nulls.
3. **Performance/Memory**: The factory methods return highly optimized, memory-efficient internal implementations based on the number of arguments (e.g., specific classes for 1 or 2 elements).

### Life Analogy
`Collections.unmodifiableList` is looking at a live play through a soundproof glass window—you can't touch the actors, but they can still move around. `List.of()` is taking a photograph of the play—it is permanently frozen exactly as it was captured, forever.

### Key Points
- Use `List.of()`, `Set.of()`, and `Map.of()`.
- Truly immutable, not just read-only wrappers.
- They do not allow `null` values.
- Highly optimized for memory.
