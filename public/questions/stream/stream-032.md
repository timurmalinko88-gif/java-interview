---
id: stream-032
topic: Stream API
difficulty: Middle
format: Code Review
time: 5
frequency: 70%
source: Custom
prerequisites: ["Stream API"]
tags: [spring-core, oop, stream-api, collections]
---

# Stream Execution Order
Review the following code. In what order are the operations executed? Will it print "Map: A", "Map: B", "Map: C", then "Filter: A"...?

```java
Stream.of("A", "B", "C")
    .map(s -> {
        System.out.println("Map: " + s);
        return s.toLowerCase();
    })
    .filter(s -> {
        System.out.println("Filter: " + s);
        return s.startsWith("a");
    })
    .forEach(s -> System.out.println("ForEach: " + s));
```

---ANSWER---

No, it will not process all elements through `map` first and then all through `filter`. Streams are evaluated **vertically** (element by element), not horizontally (operation by operation). 

The stream processes a single element entirely through the pipeline before moving on to the next element (unless a stateful operation like `sorted()` is encountered, which requires the entire stream to be buffered).

**The actual output will be:**
```text
Map: A
Filter: a
ForEach: a
Map: B
Filter: b
Map: C
Filter: c
```
*Notice how 'A' goes all the way through map, filter, and forEach before 'B' even enters the map step.*

This vertical execution allows streams to be lazy and supports short-circuiting. If there was a `limit(1)` at the end, 'B' and 'C' would never even be mapped, saving computation time.

### Life Analogy
If you are washing 3 cars (wash, dry, wax).
Horizontal execution (loops/collections) means you wash all 3, then dry all 3, then wax all 3.
Vertical execution (Streams) means you wash, dry, and wax Car 1 completely before you even turn on the hose for Car 2.

### Key Points
- Streams process data vertically (element by element).
- This is a core part of how laziness and short-circuiting are implemented.
- Stateful operations (like `sorted`) break this vertical processing, forcing horizontal buffering.
