---
id: stream-042
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 75%
source: Custom
prerequisites: ["Stream API"]
---

# anyMatch() vs Collection.contains()
What is the difference between using `list.contains(item)` and `list.stream().anyMatch(e -> e.equals(item))`? Is there a performance difference?

---ANSWER---

Both approaches check if a specific element exists in the collection, but they operate differently under the hood.

**`Collection.contains(item)`:**
- **How it works:** It uses the underlying data structure's native search mechanism.
- **Performance:** For a `HashSet`, this is an **O(1)** (constant time) operation because it uses a hash lookup. For an `ArrayList`, it is **O(N)** because it iterates through the array. 

**`list.stream().anyMatch(e -> e.equals(item))`:**
- **How it works:** It creates a stream pipeline and evaluates the predicate against elements sequentially (or in parallel) until it finds a match (short-circuiting).
- **Performance:** It is strictly **O(N)**, even if the underlying collection is a `HashSet`. The stream API does not know about or utilize the hash table structure; it just treats the Set as an iterable sequence of elements.

Therefore, for simple equality checks, `Collection.contains()` is almost always superior in terms of performance and readability. You should only use `anyMatch()` when you need to check for a complex condition (e.g., `anyMatch(e -> e.getName().startsWith("A") && e.getAge() > 30)`).

### Life Analogy
If you are looking for the word "Apple" in a dictionary (`HashSet`):
- `contains()`: You use the alphabetical index to jump straight to the 'A' section and find it instantly.
- `anyMatch()`: You start reading the dictionary from page 1, word by word, until you happen to hit "Apple".

### Key Points
- Use `contains()` for simple object equality checks; it utilizes native collection optimizations (like O(1) hash lookups).
- Use `anyMatch()` for complex, conditional predicate checks.
- `anyMatch()` is always O(N) linear search, regardless of the underlying collection type.
