---
id: stream-013
topic: Stream API
difficulty: Middle
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Stream API"]
---

# Using groupingBy
How would you use the Stream API and Collectors to group a list of `Employee` objects by their `department`? Provide the code.

```java
class Employee {
    String name;
    String department;
    // constructors, getters
}
// List<Employee> employees = ...
```

---ANSWER---

To group elements based on a specific property, you use the `Collectors.groupingBy()` method as the terminal operation inside the `collect()` method.

The `groupingBy()` collector takes a classification function (usually a method reference) and returns a `Map` where the keys are the grouped properties, and the values are Lists of items that share that property.

**Code Solution:**
```java
Map<String, List<Employee>> employeesByDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));
```

You can also provide a downstream collector to perform further operations on the grouped lists. For example, to count the number of employees in each department:
```java
Map<String, Long> countByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment, 
        Collectors.counting()
    ));
```

### Life Analogy
Imagine you have a giant bucket of mixed LEGO blocks. `groupingBy(Color)` is like taking that bucket and sorting it into several smaller buckets: one bucket for red blocks, one for blue, and one for yellow. The color is the "key", and the bucket of matching blocks is the "value".

### Key Points
- `Collectors.groupingBy()` is used to categorize stream elements into a `Map`.
- The classification function defines the keys of the resulting `Map`.
- You can cascade collectors (downstream collectors) inside `groupingBy()` for complex aggregations.
