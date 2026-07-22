---
id: stream-048
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 50%
source: Custom
prerequisites: ["Stream API"]
tags: [spring-core, oop, stream-api, collections]
---

# summarizingInt vs mapToInt.summaryStatistics
You can get summary statistics in two ways: using `Collectors.summarizingInt()` or by calling `mapToInt().summaryStatistics()`. Is there a difference, and when would you use one over the other?

---ANSWER---

Both approaches compute the exact same metrics (count, sum, min, max, average) and return an `IntSummaryStatistics` object. The difference is their context and placement in the Stream pipeline.

**`mapToInt().summaryStatistics()`:**
- **Mechanism:** You convert the Object stream to a primitive `IntStream` using the intermediate `mapToInt` operation, and then call the terminal `summaryStatistics` operation.
- **Use case:** Use this when you are reducing the *entire* top-level stream. It is generally preferred because it is slightly cleaner and avoids the boxing/unboxing overhead of Collectors.

**`Collectors.summarizingInt()`:**
- **Mechanism:** You keep the stream as an Object stream and pass this Collector into the terminal `.collect()` method.
- **Use case:** Use this when you are doing **multi-level reductions**, specifically as a downstream collector inside `Collectors.groupingBy()`.

**Example of grouping by (Requires Collectors.summarizingInt):**
```java
// Group employees by department, and get salary statistics for EACH department
Map<String, IntSummaryStatistics> statsByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.summarizingInt(Employee::getSalary)
    ));
```
*(You cannot use `mapToInt().summaryStatistics()` here because `groupingBy` requires a `Collector` as its downstream argument).*

### Life Analogy
`mapToInt().summaryStatistics()` is like taking all the company's financial records to the central accounting office for one big yearly report.
`Collectors.summarizingInt()` is like giving a portable calculator to every department manager so they can calculate the statistics for their specific department independently.

### Key Points
- Both return `IntSummaryStatistics`.
- Use `mapToInt().summaryStatistics()` for top-level stream calculations.
- Use `Collectors.summarizingInt()` as a downstream collector inside `groupingBy`.
