---
id: stream-046
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Stream API"]
tags: ['stream-api']
---

# IntStream range() vs rangeClosed()
What is the difference between `IntStream.range(start, end)` and `IntStream.rangeClosed(start, end)`?

---ANSWER---

Both methods generate a sequential ordered `IntStream` from a starting value to an ending value, with an incremental step of 1. The difference is how they handle the ending value.

**`IntStream.range(startInclusive, endExclusive)`:**
- Generates a stream from the start value up to, but **not including**, the end value.
- It acts like a traditional `for(int i = start; i < end; i++)` loop.
- `IntStream.range(1, 5)` produces elements: `1, 2, 3, 4`.

**`IntStream.rangeClosed(startInclusive, endInclusive)`:**
- Generates a stream from the start value up to and **including** the end value.
- It acts like a `for(int i = start; i <= end; i++)` loop.
- `IntStream.rangeClosed(1, 5)` produces elements: `1, 2, 3, 4, 5`.

These methods are also available on `LongStream`, but not on `DoubleStream` (because defining a step of 1 for floating-point numbers is ambiguous and prone to precision errors).

### Life Analogy
If a teacher says "Read pages 10 to 20":
- `range(10, 20)` means you stop reading right before page 20 (you only read up to page 19).
- `rangeClosed(10, 20)` means you read page 20 as well.

### Key Points
- `range` is exclusive of the end boundary.
- `rangeClosed` is inclusive of the end boundary.
- These methods are excellent replacements for traditional indexed `for` loops.
