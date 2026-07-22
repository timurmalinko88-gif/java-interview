---
id: stream-033
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 80%
source: Custom
prerequisites: ["Stream API"]
tags: [oop, spring-core, patterns, stream-api, memory, collections]
---

# Stream to Array
How do you convert a Java Stream into an Array? What syntax changes were introduced in Java 11 to make this easier?

---ANSWER---

To convert a stream into an array, you use the terminal `toArray()` method.

**Prior to Java 11 (and still valid):**
Calling `.toArray()` without arguments returns an `Object[]`. To get a strongly typed array (like `String[]`), you had to pass an array constructor reference (a generator function).
```java
Stream<String> stream = Stream.of("A", "B", "C");

// Returns Object[]
Object[] objArray = stream.toArray();

// Returns String[] using a constructor reference
String[] strArray = stream.toArray(String[]::new);
```

**Java 11 and later:**
Java 11 introduced a new overloaded `toArray(IntFunction<A[]> generator)` directly on the `Collection` interface to make converting collections to arrays easier, but for *Streams*, `toArray(generator)` has always been there since Java 8. However, Java 11 introduced the default method `toArray(IntFunction)` directly on collections, bridging the gap. For Streams specifically, `stream.toArray(String[]::new)` remains the standard.

For Primitive Streams (`IntStream`, `LongStream`, `DoubleStream`), `.toArray()` automatically returns the exact primitive array (`int[]`, `long[]`, `double[]`) without needing a generator.
```java
IntStream intStream = IntStream.of(1, 2, 3);
int[] ints = intStream.toArray(); // returns int[], not Integer[] or Object[]
```

### Life Analogy
`toArray()` is like pouring a flowing river (Stream) into a solid, fixed-size ice cube tray (Array). The `String[]::new` argument just tells the tray factory exactly what shape of ice cubes you want the tray to produce.

### Key Points
- `.toArray()` without arguments yields `Object[]`.
- Pass `Type[]::new` to get a strongly-typed array.
- Primitive streams yield primitive arrays natively.
