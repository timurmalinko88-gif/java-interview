---
id: collections-027
topic: Collections
difficulty: Middle
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Arrays"]
---

# Arrays.asList vs List.of
What is the difference between `Arrays.asList(1, 2, 3)` and `List.of(1, 2, 3)`?

---ANSWER---

Both methods provide a quick way to create a list from a varargs array, but they have distinct behavioral differences.

1. **Mutability (Add/Remove)**:
   - Neither allows structural modifications (adding or removing elements). Both will throw `UnsupportedOperationException` if you call `add()` or `remove()`.

2. **Mutability (Set/Update)**:
   - `Arrays.asList()` **allows** you to replace existing elements using the `set(index, element)` method.
   - `List.of()` is truly immutable and does **not** allow updating elements via `set()`.

3. **Array Backing**:
   - `Arrays.asList()` returns a wrapper that directly backs onto the provided array. If you modify the original array, the List changes. If you modify the List (via `set`), the original array changes.
   - `List.of()` creates an independent, immutable copy.

4. **Nulls**:
   - `Arrays.asList()` allows `null` elements.
   - `List.of()` throws a `NullPointerException` if any element is `null`.

### Life Analogy
`Arrays.asList` is renting an apartment. You can't add or remove rooms (structural changes), but you can paint the walls a different color (using `set`). `List.of` is buying a pre-built Lego house glued together. You can't add bricks, remove bricks, or even swap out a red brick for a blue one.

### Key Points
- `Arrays.asList` allows `set()`, `List.of` is entirely immutable.
- `Arrays.asList` is backed by the array (changes reflect mutually).
- `Arrays.asList` permits nulls, `List.of` strictly forbids nulls.
