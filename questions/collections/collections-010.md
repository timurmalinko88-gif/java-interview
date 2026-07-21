---
id: collections-010
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Data Structures"]
---

# Vector vs ArrayList
What are the differences between `Vector` and `ArrayList`?

---ANSWER---

Both `Vector` and `ArrayList` implement the `List` interface and use a dynamic array internally, but there are a few historical and structural differences:

1. **Synchronization:** `Vector` is a legacy class and almost all its methods are synchronized, meaning it is thread-safe. `ArrayList` is not synchronized and is not thread-safe.
2. **Performance:** Because of the synchronization overhead, `Vector` is generally much slower than `ArrayList` in a single-threaded environment.
3. **Resizing:** When a `Vector` runs out of space, it doubles its size by default (increases by 100%). When an `ArrayList` runs out of space, it increases its size by 50%.

Today, `Vector` is considered obsolete. If you need a thread-safe list, you should use `Collections.synchronizedList(new ArrayList<>())` or a concurrent list like `CopyOnWriteArrayList`.

### Life Analogy
`Vector` is an old, heavy bank vault door. It takes a lot of effort to open and close, ensuring safety but slowing everything down. `ArrayList` is a modern sliding door—fast and efficient, but if two people try to jam through it at the exact same moment, things can break.

### Key Points
- `Vector` is synchronized, `ArrayList` is not.
- `Vector` doubles in capacity; `ArrayList` increases capacity by 50%.
- `Vector` is a legacy class and largely replaced by `ArrayList`.
