---
id: stream-025
topic: Stream API
difficulty: Middle
format: Code Review
time: 5
frequency: 55%
source: Custom
prerequisites: ["Stream API"]
tags: [oop, spring-core, stream-api, memory, collections]
---

# flatMap vs flatMapToInt
Review the code below. Why doesn't it compile, and how can you fix it using primitive streams?

```java
List<String> sentences = Arrays.asList("Hello world", "Java streams");

// Goal: Find the total number of characters across all words, excluding spaces
int totalChars = sentences.stream()
    .flatMap(sentence -> Arrays.stream(sentence.split(" ")))
    .map(word -> word.length())
    .sum();
```

---ANSWER---

The code does not compile because the `sum()` method is not available on an object `Stream<T>`. 

In the code provided:
1. `flatMap` returns a `Stream<String>` (individual words).
2. `map(word -> word.length())` returns a `Stream<Integer>`.
Object streams do not have aggregate math functions like `sum()`, `average()`, or `max()` built into them directly (you'd have to use `reduce` or a collector).

**Fix:**
To use `sum()`, you need to convert the object stream into an `IntStream`. This is done by using `mapToInt` instead of `map`.

```java
int totalChars = sentences.stream()
    .flatMap(sentence -> Arrays.stream(sentence.split(" ")))
    .mapToInt(word -> word.length()) // Returns IntStream
    .sum(); // Now valid!
```

*Alternative involving flatMapToInt:*
If the inner structure inherently produced an IntStream, you would use `flatMapToInt`. But here, the split produces Strings, so `mapToInt` is the correct fix.

### Life Analogy
Trying to call `.sum()` on a `Stream<Integer>` is like asking a librarian to weigh a stack of books, but the scale only works on loose paper. The books (Objects) are too bulky for the math-specific scale. `mapToInt` rips the pages out of the bindings (unboxing to primitives) so the math-specific scale (`sum()`) can process them perfectly.

### Key Points
- `Stream<T>` does not have `sum()`, `average()`, etc.
- You must transition to a primitive stream (`IntStream`, `LongStream`, `DoubleStream`) to access these methods.
- Use `mapToInt`, `mapToLong`, or `mapToDouble` for this transition.
