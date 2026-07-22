---
id: stream-010
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Stream API"]
tags: ['stream-api']
---

# findFirst() vs findAny()
What is the difference between `findFirst()` and `findAny()` in the Stream API? When would you choose one over the other?

---ANSWER---

Both `findFirst()` and `findAny()` are terminal, short-circuiting operations that return an `Optional<T>` describing an element of the stream.

**`findFirst()`:**
- Always returns the *first* element in the stream based on the encounter order (if the stream has an order, like from a List).
- In a parallel stream, it must still enforce order and ensure the absolute first element is returned, which can be computationally expensive and limit parallel efficiency.

**`findAny()`:**
- Returns *any* element from the stream.
- In a sequential stream, it often behaves exactly like `findFirst()` (returning the first element).
- In a parallel stream, it shines: it returns the first element that *any* thread finishes processing. It does not wait to check encounter order. This makes it significantly faster when parallelized.

**When to use:**
- Use `findFirst()` when the order of the source matters (e.g., finding the first chronological log entry).
- Use `findAny()` when you just need *a* matching element and don't care which one, especially if you plan to use parallel streams.

### Life Analogy
Imagine looking for a $20 bill hidden in a large stack of books.
`findFirst()` means you must start from the top book and check sequentially downward. Even if a friend (a parallel thread) finds one in the middle, you tell them to wait until you are sure there isn't one closer to the top.
`findAny()` means you and your friends check randomly, and whoever finds a $20 bill first yells "Found it!", and the search immediately ends.

### Key Points
- `findFirst()` respects the encounter order of the stream.
- `findAny()` does not guarantee order and returns any matching element.
- `findAny()` is much more efficient in parallel streams.
- Both return an `Optional`.
