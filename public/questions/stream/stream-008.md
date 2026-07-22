---
id: stream-008
topic: Stream API
difficulty: Senior
format: System Design
time: 10
frequency: 75%
source: Custom
prerequisites: ["Parallel Streams"]
tags: ['stream-api']
---

# When to avoid Parallel Streams?
Parallel streams (`parallelStream()`) can speed up processing by utilizing multiple CPU cores. However, they are not a silver bullet. Under what circumstances should you *avoid* using parallel streams, and why?

---ANSWER---

While `parallelStream()` splits work across multiple threads (using the common ForkJoinPool), using it improperly can actually make the application *slower* or introduce subtle bugs.

You should avoid parallel streams in the following scenarios:

1. **Small Datasets**: The overhead of splitting the data, managing threads, and merging the results often exceeds the time saved by processing in parallel. 
2. **IO-Bound Tasks**: If the stream elements involve blocking I/O operations (like database calls, file reading, network requests), the limited threads in the common ForkJoinPool will block. This can starve other parts of the application relying on the same pool.
3. **Stateful/Order-Dependent Operations**: Operations like `limit()`, `findFirst()`, and `sorted()` require coordination across threads, eliminating parallel benefits.
4. **Non-Thread-Safe Collections/Operations**: If the operations inside `map` or `forEach` modify shared mutable state without proper synchronization, it will lead to race conditions and data corruption.
5. **Cost of Splitting**: If the underlying data structure does not split easily (e.g., `LinkedList` or `HashSet`), traversing it to split tasks takes too long. `ArrayList` splits very efficiently.

### Life Analogy
Imagine assigning 10 painters to paint a tiny bathroom. They will bump into each other, spend time coordinating who paints which tile, and ultimately take longer than 1 painter. (Small dataset / Overhead).
Or, assigning 10 painters but providing only one paint bucket. They will constantly wait in line for the bucket. (Blocking I/O).

### Key Points
- Avoid parallel streams for small collections or cheap operations.
- Never use parallel streams for blocking I/O operations.
- Shared mutable state inside a parallel stream leads to race conditions.
- ArrayLists split well; LinkedLists do not.
