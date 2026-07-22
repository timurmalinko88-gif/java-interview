---
id: stream-029
topic: Stream API
difficulty: Senior
format: Open Answer
time: 5
frequency: 40%
source: Custom
prerequisites: ["Stream API"]
tags: ['stream-api']
---

# mapMulti()
What is the `mapMulti` operation introduced in Java 16? How is it different from `flatMap`, and when should you prefer it?

---ANSWER---

`mapMulti` is an intermediate operation in the Stream API introduced in Java 16. It serves as an imperative, push-based alternative to the functional, pull-based `flatMap`.

It takes a `BiConsumer<T, Consumer<R>>`. For each element of type `T` in the stream, you can explicitly push zero, one, or multiple elements of type `R` into the provided `Consumer` to pass them downstream.

**Code Example:**
```java
// flatMap approach
stream.flatMap(e -> {
    if (e.isValid()) return Stream.of(e.getA(), e.getB());
    return Stream.empty();
});

// mapMulti approach
stream.mapMulti((e, consumer) -> {
    if (e.isValid()) {
        consumer.accept(e.getA());
        consumer.accept(e.getB());
    }
});
```

**Why prefer it over `flatMap`?**
1. **Performance:** `flatMap` requires wrapping the output of every element in a new `Stream` object, which creates a lot of garbage overhead, especially if the stream is empty or only yields 1-2 elements. `mapMulti` avoids creating these intermediate Stream objects completely.
2. **Imperative logic:** Sometimes, complex if-else logic or traditional `for` loops are easier to write imperatively. `mapMulti` allows you to push elements directly using a Consumer inside a traditional block of code.

### Life Analogy
`flatMap` is like asking every worker to put their completed parts into a separate tiny box, and then you have to unpack all those tiny boxes into the main shipping crate.
`mapMulti` gives every worker a chute that goes directly into the main shipping crate. They just drop their parts straight in (`consumer.accept()`), saving the cost of the tiny boxes.

### Key Points
- `mapMulti` was added in Java 16.
- It is an alternative to `flatMap` with less object-creation overhead.
- You push elements downstream explicitly via a `Consumer`.
