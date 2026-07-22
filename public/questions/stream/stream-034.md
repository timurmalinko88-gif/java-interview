---
id: stream-034
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 50%
source: Custom
prerequisites: ["Stream API"]
tags: ['stream-api']
---

# Stream.builder()
If you don't have a Collection or an Array to start with, how can you construct a Stream element by element?

---ANSWER---

You can construct a Stream manually, element by element, using the `Stream.Builder` interface. 

You obtain a builder by calling `Stream.builder()`. You can then add elements using the `add(T t)` or `accept(T t)` methods. Once you are done adding elements, you call `build()` to generate the final Stream. 

After `build()` is called, the builder transitions to a built state, and trying to add more elements will throw an `IllegalStateException`.

**Code Example:**
```java
Stream.Builder<String> builder = Stream.builder();
builder.add("Apple");
builder.add("Banana");
builder.accept("Cherry"); // accept is from the Consumer interface

Stream<String> stream = builder.build();
```

Note: If you already know all the elements at compile time, `Stream.of("Apple", "Banana", "Cherry")` is much cleaner. `Stream.Builder` is primarily useful when you need to dynamically construct the contents of the stream within a loop or conditional logic before the stream pipeline begins.

### Life Analogy
`Stream.builder()` is like building a custom train. You lay down the engine, then conditionally add passenger cars or cargo cars one by one in the railyard (`add()`). Once you are satisfied, you give the departure signal (`build()`), and the train leaves the station on the tracks (the Stream pipeline). You cannot add more cars once it has left.

### Key Points
- Use `Stream.builder()` to dynamically assemble stream elements.
- Uses `add()` or `accept()` to append items.
- Call `build()` to create the stream.
- Cannot add elements after `build()` is invoked.
