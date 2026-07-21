---
id: stream-035
topic: Stream API
difficulty: Senior
format: Open Answer
time: 5
frequency: 45%
source: Custom
prerequisites: ["Stream API"]
---

# Teeing Collector
What is the `Collectors.teeing()` method introduced in Java 12? What specific problem does it solve?

---ANSWER---

Introduced in Java 12, `Collectors.teeing()` is a composite collector that allows you to perform two separate collecting operations on the same stream concurrently, and then merge their results into a single object.

**Problem it solves:**
Before `teeing()`, if you needed to compute two different aggregations (e.g., finding both the minimum and the maximum of a stream, or the sum and the count for a custom average), you either had to write a complex custom Collector, or you had to consume the stream twice (which isn't allowed without recreating the stream).

**How it works:**
It takes three arguments:
1. `Collector 1` (Downstream 1)
2. `Collector 2` (Downstream 2)
3. `BiFunction` (Merger function to combine the results of Collector 1 and 2).

**Code Example:**
Finding the Max and Min from a single stream:
```java
List<Integer> numbers = Arrays.asList(5, 10, 15, 20);

// Result could be a custom Map, Array, or Object. We use a Map here.
Map<String, Integer> range = numbers.stream().collect(
    Collectors.teeing(
        Collectors.maxBy(Integer::compareTo), 
        Collectors.minBy(Integer::compareTo),
        (max, min) -> Map.of("Max", max.get(), "Min", min.get())
    )
);
```

### Life Analogy
Imagine a water pipe that splits into two ("T" shaped pipe junction, hence the name "teeing"). The water (stream) flows into both pipes simultaneously. One pipe goes through a heater (Collector 1), the other through a cooler (Collector 2). At the end, they merge back into one tub (BiFunction merger) giving you warm water.

### Key Points
- Introduced in Java 12.
- Executes two downstream collectors in parallel on the same stream elements.
- Merges the two results using a provided `BiFunction`.
- Prevents the need to traverse a stream twice or write boilerplate custom collectors.
