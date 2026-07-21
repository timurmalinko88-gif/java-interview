---
id: multithreading-033
topic: Multithreading
difficulty: Senior
format: Code Review
time: 8
frequency: 75%
source: Custom
prerequisites: ["Concurrency", "Parallel Streams", "Collections"]
---

# Parallel Streams and Thread Safety
Review the following code utilizing Java 8 parallel streams. What is the potential issue, and how can it be fixed?

```java
public class ParallelStreamIssue {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        List<Integer> evenNumbers = new ArrayList<>();

        numbers.parallelStream()
               .filter(n -> n % 2 == 0)
               .forEach(n -> evenNumbers.add(n));

        System.out.println("Evens: " + evenNumbers.size());
    }
}
```

---ANSWER---

The potential issue is a **race condition** leading to data loss, incorrect sizes, or an `ArrayIndexOutOfBoundsException` / `ConcurrentModificationException`.

**Why:**
`parallelStream()` splits the input list and processes the chunks concurrently across multiple threads in the common ForkJoinPool. 
However, the operation inside `forEach` is modifying `evenNumbers`, which is a standard `ArrayList`. `ArrayList` is **not thread-safe**. 
When multiple threads simultaneously call `add()` on the same `ArrayList`, they can overwrite each other's data or trigger internal array resizing operations concurrently, corrupting the list's internal state.

**Fix:**
Never mutate a shared, non-thread-safe collection inside a parallel stream operation. Instead, use the stream's `collect` terminal operation, which is designed to handle parallel reductions safely and efficiently without shared mutable state.

```java
List<Integer> evenNumbers = numbers.parallelStream()
                                   .filter(n -> n % 2 == 0)
                                   .collect(Collectors.toList());
```
Alternatively, if you absolutely must mutate a shared collection, it must be thread-safe (e.g., `CopyOnWriteArrayList` or `Collections.synchronizedList`), but this will drastically reduce the performance benefits of the parallel stream due to lock contention.

### Life Analogy
The broken code is like 5 people trying to simultaneously write names on a single small piece of paper. They bump pens, write over each other's letters, and tear the paper.
Using `collect()` is like giving each of the 5 people their own notepad to write names on, and then an organizer cleanly staples the 5 notepads together at the very end.

### Key Points
- `parallelStream()` processes elements concurrently on multiple threads.
- Do not mutate standard collections (like `ArrayList`) from inside a parallel stream.
- Prefer functional reductions using `collect()` instead of side-effecting operations like `forEach` modifying external state.
