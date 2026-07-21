---
id: stream-044
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Lambdas", "Collections"]
---

# Map.forEach() and BiConsumer
Prior to Java 8, iterating over a `Map` required fetching the `entrySet()` and using a for-each loop. How can you iterate over a `Map` using Java 8 features?

---ANSWER---

Java 8 introduced a default `forEach()` method directly on the `Map` interface, making iteration much cleaner.

Unlike `Collection.forEach()` which takes a single-argument `Consumer`, `Map.forEach()` takes a **`BiConsumer<K, V>`** (an operation that accepts two input arguments and returns no result). This allows you to process the key and the value simultaneously in the lambda expression.

**Before Java 8:**
```java
Map<String, Integer> map = new HashMap<>();
// ... populate map ...
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " : " + entry.getValue());
}
```

**Java 8 and later:**
```java
Map<String, Integer> map = new HashMap<>();
// ... populate map ...
map.forEach((key, value) -> System.out.println(key + " : " + value));
```

*(Note: Maps do not implement the `Collection` or `Iterable` interfaces, which is why you cannot call `.stream()` directly on a Map. You must call it on `map.entrySet().stream()`, `map.keySet().stream()`, or `map.values().stream()` if you need Stream API operations).*

### Life Analogy
The old `entrySet()` loop is like an accountant asking an assistant for a folder containing all client records, opening the folder, pulling out a paper, reading the name (key), and reading the balance (value), and repeating for every paper.
`Map.forEach` is like the accountant just pointing at the assistant and saying: "Read me the name and balance of every client, one by one." The boilerplate of opening folders is abstracted away.

### Key Points
- `Map` has a default `forEach` method introduced in Java 8.
- It takes a `BiConsumer<K, V>` because maps have two components: keys and values.
- It is significantly more readable than iterating over the `entrySet`.
- Maps themselves are not Streams or Iterables.
