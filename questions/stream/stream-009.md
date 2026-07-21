---
id: stream-009
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 60%
source: Custom
prerequisites: ["Stream API"]
---

# Custom Collectors
The `Collectors` utility class provides many common reduction operations (like `toList()`, `groupingBy()`). How would you implement a custom `Collector` if the built-in ones do not meet your needs?

---ANSWER---

You can create a custom `Collector` by using the `Collector.of()` factory method or by implementing the `Collector<T, A, R>` interface. 

A Collector requires four core functions (and an optional characteristics set):
1. **Supplier (`A get()`):** Creates the intermediate accumulator container (e.g., `() -> new ArrayList<>()`).
2. **Accumulator (`BiConsumer<A, T> accumulator()`):** Folds a stream element into the accumulator container (e.g., `(list, element) -> list.add(element)`).
3. **Combiner (`BinaryOperator<A> combiner()`):** Merges two accumulator containers together. This is strictly required for parallel stream execution (e.g., `(list1, list2) -> { list1.addAll(list2); return list1; }`).
4. **Finisher (`Function<A, R> finisher()`):** Performs the final transformation from the intermediate accumulator type `A` to the final result type `R`. If `A` and `R` are the same, `Function.identity()` is used.

Example using `Collector.of`:
```java
Collector<String, StringJoiner, String> myJoiner = Collector.of(
    () -> new StringJoiner(", "), // Supplier
    StringJoiner::add,            // Accumulator
    StringJoiner::merge,          // Combiner
    StringJoiner::toString        // Finisher
);
```

### Life Analogy
Think of a Collector as a recycling process.
- **Supplier:** Getting empty recycling bins.
- **Accumulator:** Throwing individual plastic bottles into a bin.
- **Combiner:** Pouring smaller bins from different rooms into one big dumpster.
- **Finisher:** Melting the dumped plastic to create a brand-new park bench.

### Key Points
- A Collector is defined by a supplier, accumulator, combiner, and finisher.
- The combiner is crucial for parallel processing to merge thread-local results.
- `Collector.of()` is the easiest way to create a custom collector inline.
