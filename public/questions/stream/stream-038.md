---
id: stream-038
topic: Stream API
difficulty: Middle
format: Open Answer
time: 5
frequency: 50%
source: Custom
prerequisites: ["Stream API"]
tags: [oop, spring-core, system-design, stream-api, collections]
---

# Collectors.reducing
You can perform reductions using the `stream.reduce()` terminal operation, but there is also a `Collectors.reducing()` collector. Why does the collector version exist, and when would you use it?

---ANSWER---

While `stream.reduce()` is designed to reduce the elements of the *entire* stream directly, `Collectors.reducing()` does the exact same thing but packages the reduction logic into a `Collector` object.

The primary reason `Collectors.reducing()` exists is for **multi-level reductions**, specifically as a downstream collector inside a `groupingBy()` or `partitioningBy()` operation.

If you just want to reduce the main stream, always use `stream.reduce()`.

**Example Use Case:**
Find the highest paid employee *in each department*.
```java
Map<String, Optional<Employee>> highestPaidByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.reducing(BinaryOperator.maxBy(Comparator.comparing(Employee::getSalary)))
    ));
```
*(Note: For this specific max/min use case, Java also provides `Collectors.maxBy()`, which internally just calls `Collectors.reducing()`!)*

### Life Analogy
`stream.reduce()` is like putting all the votes in a country into one massive pile and counting them to find the president.
`Collectors.reducing()` is a portable vote-counter that you can give to individual states. First, you group the votes by state (`groupingBy`), and then you hand each state the portable counter (`Collectors.reducing`) to find the winner for that specific state.

### Key Points
- `Collectors.reducing()` wraps reduction logic in a Collector.
- Used almost exclusively as a downstream collector (cascaded inside `groupingBy`).
- Use `stream.reduce()` for top-level stream reductions.
