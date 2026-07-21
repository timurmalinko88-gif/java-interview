---
id: stream-021
topic: Stream API
difficulty: Middle
format: Code Review
time: 5
frequency: 85%
source: Custom
prerequisites: ["Stream API"]
---

# Collectors.toMap and Duplicate Keys
Review the following code. What happens when this code is executed? How would you fix the issue if the intention is to keep the latest employee mapped to the department?

```java
class Employee { String dept; String name; }

List<Employee> employees = Arrays.asList(
    new Employee("IT", "Alice"),
    new Employee("HR", "Bob"),
    new Employee("IT", "Charlie")
);

Map<String, String> map = employees.stream()
    .collect(Collectors.toMap(e -> e.dept, e -> e.name));
```

---ANSWER---

When this code is executed, it will throw an `IllegalStateException: Duplicate key IT (attempted merging values Alice and Charlie)`.

**Reason:**
By default, `Collectors.toMap(keyMapper, valueMapper)` expects all keys to be strictly unique. If it encounters two elements that map to the same key, it throws an exception because it does not know how you want to handle the collision (should it keep the old value, overwrite it with the new value, or combine them?).

**Fix:**
To handle duplicate keys, you must use the overloaded version of `toMap` that accepts a third parameter: a `mergeFunction` (a `BinaryOperator`). This function defines what to do when a collision occurs.

To keep the *latest* employee (the new value):
```java
Map<String, String> map = employees.stream()
    .collect(Collectors.toMap(
        e -> e.dept, 
        e -> e.name, 
        (existingValue, newValue) -> newValue // Keep the newest
    ));
```
*(If the intention was to group all employees in the department into a list, `Collectors.groupingBy()` should have been used instead).*

### Life Analogy
`Collectors.toMap` without a merge function is like a valet parking attendant who is told that every driver has a unique parking spot number. When two different drivers show up claiming spot #12 (duplicate key), the attendant panics and throws an exception. 
Adding the merge function is like giving the attendant instructions: "If two people claim spot #12, let the second guy park there and kick the first guy out."

### Key Points
- Default `Collectors.toMap` throws `IllegalStateException` on duplicate keys.
- Provide a `mergeFunction` as the third argument to define collision resolution logic.
- The `mergeFunction` receives both the existing value and the incoming new value.
