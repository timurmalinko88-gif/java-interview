---
id: stream-024
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 50%
source: Custom
prerequisites: ["Stream API"]
tags: [oop, spring-core, stream-api, memory, collections, exceptions]
---

# Stream.concat()
How do you merge two streams into a single stream? Are there any performance considerations when doing this repeatedly?

---ANSWER---

You merge two streams into a single stream using the static method `Stream.concat(Stream a, Stream b)`.

It creates a lazily concatenated stream whose elements are all the elements of the first stream followed by all the elements of the second stream.

Example:
```java
Stream<String> s1 = Stream.of("A", "B");
Stream<String> s2 = Stream.of("C", "D");
Stream<String> result = Stream.concat(s1, s2);
// result contains A, B, C, D
```

**Performance Considerations & Caveats:**
1. **Closing:** The resulting concatenated stream is linked to the parent streams. When the concatenated stream is closed, it will close both `a` and `b` streams.
2. **Deeply Nested Concatenation:** You should avoid chaining multiple `Stream.concat` calls in a loop (e.g., concatenating 100 streams together). This creates a deeply nested tree structure that can cause performance degradation or a `StackOverflowError` when the pipeline is finally evaluated. 
If you need to combine many streams, it is much better to put them in a Collection and use `flatMap`:
```java
// Better for many streams
List<Stream<String>> streams = getManyStreams();
Stream<String> combined = streams.stream().flatMap(s -> s);
```

### Life Analogy
`Stream.concat` is like taping two garden hoses together end-to-end to make a longer hose. Taping two together is perfectly fine. But if you tape 1,000 tiny hoses together, the water pressure (performance) drops significantly, and the hose might burst at the seams (StackOverflowError).

### Key Points
- Use `Stream.concat(a, b)` to merge exactly two streams.
- Avoid deep chaining of `concat` in loops.
- Use `flatMap` if you need to merge three or more streams dynamically.
