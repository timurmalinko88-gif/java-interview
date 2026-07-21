---
id: stream-006
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Stream API"]
---

# What is the difference between map() and flatMap()?
Both `map()` and `flatMap()` are intermediate operations used for transformation. Explain the core difference between them and when you would use each.

---ANSWER---

Both `map()` and `flatMap()` transform elements in a stream, but they handle the resulting structures differently.

**`map()`:**
- **Function:** Applies a given function to each element of the stream, producing a new stream of the transformed elements.
- **Mapping relationship:** 1-to-1 (One input element produces exactly one output element).
- **Result:** If the mapping function returns a Collection/Stream, you end up with a Stream of Collections/Streams (e.g., `Stream<List<String>>`).

**`flatMap()`:**
- **Function:** Applies a given function to each element, but the function must return a Stream. `flatMap()` then "flattens" these multiple streams into a single, unified stream.
- **Mapping relationship:** 1-to-N (One input element can produce zero, one, or multiple output elements).
- **Result:** It unwraps the inner structures. E.g., transforming a `Stream<List<String>>` into a flat `Stream<String>`.

Example:
```java
List<List<String>> nested = Arrays.asList(
    Arrays.asList("A", "B"), 
    Arrays.asList("C", "D")
);

// map() -> Stream<List<String>>
nested.stream().map(list -> list).forEach(System.out::print); // Prints [A, B][C, D]

// flatMap() -> Stream<String>
nested.stream().flatMap(Collection::stream).forEach(System.out::print); // Prints ABCD
```

### Life Analogy
`map()` is like putting apples into individual boxes. If you pass it a list of apples, you get a list of boxes.
`flatMap()` is like having multiple small boxes of apples and emptying them all into one giant basket. It "flattens" the containers so you are just left with the raw apples.

### Key Points
- `map()` is used for simple 1-to-1 transformations.
- `flatMap()` is used for 1-to-many transformations and flattening nested structures.
- `flatMap()` expects the mapping function to return a Stream.
