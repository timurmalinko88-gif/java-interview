---
id: stream-039
topic: Stream API
difficulty: Middle
format: Code Review
time: 5
frequency: 75%
source: Custom
prerequisites: ["Stream API"]
---

# Comparator.comparing
Review the code below. How can you simplify the lambda expression inside the `sorted()` method using Java 8 features? How would you reverse the sort order?

```java
class Employee { String name; int age; /* getters */ }
List<Employee> list = // ...

List<Employee> sortedList = list.stream()
    .sorted((e1, e2) -> Integer.compare(e1.getAge(), e2.getAge()))
    .collect(Collectors.toList());
```

---ANSWER---

The lambda expression inside the `sorted()` method can be vastly simplified using the `Comparator.comparing()` static factory method, coupled with a method reference.

**Simplified Code:**
```java
List<Employee> sortedList = list.stream()
    .sorted(Comparator.comparing(Employee::getAge))
    .collect(Collectors.toList());
```

To avoid autoboxing overhead (since `age` is an `int`), it is even better to use the primitive specialization `comparingInt`:
```java
    .sorted(Comparator.comparingInt(Employee::getAge))
```

**Reversing the Sort Order:**
To sort in descending order, you can chain the `.reversed()` default method provided by the `Comparator` interface:
```java
    .sorted(Comparator.comparingInt(Employee::getAge).reversed())
```

### Life Analogy
Writing the full lambda `(e1, e2) -> Integer.compare(e1.getAge(), e2.getAge())` is like explicitly instructing a librarian: "Take book 1, look at its year. Take book 2, look at its year. Now tell me which year is smaller."
Using `Comparator.comparing(Book::getYear)` is like simply saying: "Sort these by year." The intent is much clearer and less prone to typos.

### Key Points
- `Comparator.comparing()` accepts a key extractor function (usually a method reference) to generate a comparator.
- Use `comparingInt/Long/Double` to avoid primitive autoboxing.
- Chain `.reversed()` to flip the sorting order.
- Chain `.thenComparing()` for secondary/fallback sorting.
