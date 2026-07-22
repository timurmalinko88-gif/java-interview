---
id: stream-026
topic: Stream API
difficulty: Junior
format: Open Answer
time: 5
frequency: 70%
source: Custom
prerequisites: ["Stream API"]
tags: [spring-core, oop, stream-api, collections]
---

# Summary Statistics
How can you quickly find the minimum, maximum, average, sum, and count of a list of integers using the Stream API without iterating multiple times?

---ANSWER---

You can achieve this in a single pass using the `summaryStatistics()` method provided by primitive streams.

When you convert an Object stream to a primitive stream (e.g., `IntStream`, `LongStream`, `DoubleStream`), you gain access to the `summaryStatistics()` terminal operation. It returns a specialized object (e.g., `IntSummaryStatistics`) that computes all these metrics simultaneously in one pass over the data.

Example:
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

IntSummaryStatistics stats = numbers.stream()
    .mapToInt(Integer::intValue)
    .summaryStatistics();

System.out.println("Max: " + stats.getMax());
System.out.println("Min: " + stats.getMin());
System.out.println("Sum: " + stats.getSum());
System.out.println("Average: " + stats.getAverage());
System.out.println("Count: " + stats.getCount());
```

### Life Analogy
Imagine you are at a checkout counter with a basket of items.
Instead of going through the basket once to count the items, a second time to find the most expensive one, and a third time to calculate the total price, the `summaryStatistics` cashier scans everything exactly once and instantly prints a receipt with all the totals and metrics at the bottom.

### Key Points
- `summaryStatistics()` computes count, sum, min, max, and average simultaneously.
- It is available on primitive streams (`IntStream`, `LongStream`, `DoubleStream`).
- It prevents the need to iterate the stream multiple times for different metrics.
