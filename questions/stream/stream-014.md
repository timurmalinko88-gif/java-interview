---
id: stream-014
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Stream API"]
---

# partitioningBy vs groupingBy
What is the difference between `Collectors.partitioningBy()` and `Collectors.groupingBy()`?

---ANSWER---

Both are `Collector` implementations used to categorize stream elements, but they serve different use cases based on their classification logic.

**`groupingBy()`:**
- **Classifier:** Accepts a `Function` that can return any type (String, Integer, Enum, Object).
- **Result:** Produces a `Map<K, List<T>>` where there can be any number of keys (K) depending on the distinct values returned by the classification function.
- **Use case:** Grouping by a category, like grouping employees by department name or age.

**`partitioningBy()`:**
- **Classifier:** Accepts a `Predicate` (a function that strictly returns `true` or `false`).
- **Result:** Produces a `Map<Boolean, List<T>>`. The map will *always* have exactly two keys: `true` and `false` (even if one of the lists is empty).
- **Use case:** Dividing data into exactly two sets based on a condition, like partitioning employees into "managers" and "non-managers", or numbers into "even" and "odd".
- **Performance:** `partitioningBy()` is slightly faster and more optimized than a `groupingBy` that returns boolean, because the underlying implementation is hardcoded for exactly two buckets.

### Life Analogy
`groupingBy` is like sorting mail by zip code. You could end up with dozens or hundreds of different piles.
`partitioningBy` is a strict binary sort, like airport customs lines: "US Citizens" go left (true), and "Foreign Passports" go right (false). There are only ever two lines.

### Key Points
- `partitioningBy` uses a Predicate; `groupingBy` uses a Function.
- `partitioningBy` always returns a Map with exactly two boolean keys (`true` and `false`).
- `groupingBy` returns a Map with dynamically generated keys.
