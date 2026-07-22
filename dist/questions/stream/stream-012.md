---
id: stream-012
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 65%
source: Custom
prerequisites: ["Stream API"]
tags: ['stream-api']
---

# Primitive Streams
Why does Java provide specialized primitive streams like `IntStream`, `LongStream`, and `DoubleStream`? Why not just use `Stream<Integer>`?

---ANSWER---

Java provides `IntStream`, `LongStream`, and `DoubleStream` to address performance and memory issues related to **autoboxing and unboxing**.

When you use `Stream<Integer>`, each element is treated as a full-fledged Java object. This means:
1. **Memory Overhead:** An `Integer` object takes up significantly more memory (typically 16-24 bytes) compared to a primitive `int` (4 bytes).
2. **CPU Overhead:** Constantly wrapping primitives into objects (boxing) and extracting them back (unboxing) wastes CPU cycles.
3. **Cache Misses:** Arrays of objects are arrays of references to memory locations scattered across the heap, which leads to poor CPU cache locality compared to contiguous primitive arrays.

Primitive streams operate directly on the raw primitive types. They also provide convenient mathematical operations out of the box that `Stream<T>` lacks, such as `sum()`, `average()`, `min()`, `max()`, and `summaryStatistics()`.

### Life Analogy
Using `Stream<Integer>` to do math is like putting every single penny you own into its own individual velvet jewelry box before counting them. It's bulky, slow, and overkill. 
Using `IntStream` is like just dumping the raw pennies onto a table and counting them quickly.

### Key Points
- Primitive streams avoid the performance penalty of autoboxing/unboxing.
- They consume much less memory.
- They provide specialized mathematical aggregate functions (`sum`, `average`).
- You can convert between object streams and primitive streams using `mapToInt()`, `mapToObj()`, `boxed()`, etc.
