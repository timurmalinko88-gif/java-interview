---
id: live-011
path: questions/live-coding/live-011.md
topic: Live Coding & Refactoring
difficulty: Senior
format: Live Coding
title: Stream API side-effects antipatterns
time: 20 min
frequency: Medium
tags: [live-coding, refactoring, bugs]
---

### Problem

A junior developer wrote the following code to filter a list of strings, convert them to uppercase, and add them to a synchronized list.

**Buggy Code:**

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

public class StreamProcessor {
    public List<String> processNames(List<String> names) {
        List<String> result = Collections.synchronizedList(new ArrayList<>());
        
        names.parallelStream()
             .filter(name -> name.startsWith("A"))
             .forEach(name -> {
                 result.add(name.toUpperCase()); // Side-effecting!
             });
             
        return result;
    }
}
```

### Challenge
Explain why mutating external state inside `forEach` is an antipattern, especially in parallel streams, and refactor the code to use standard functional stream reduction.

---

### Solution

**Explanation:**
Streams are designed to process data purely functionally without side effects. 
Mutating an external collection (`result.add(...)`) within a `forEach` block breaks the functional paradigm and leads to concurrency issues in parallel streams. While `Collections.synchronizedList` prevents data corruption, it introduces thread contention and synchronization bottlenecks, negating the performance benefits of `parallelStream()`.
The proper way is to transform the stream and collect the results using `Collectors.toList()`.

**Refactored Code:**

```java
import java.util.List;
import java.util.stream.Collectors;

public class StreamProcessor {
    public List<String> processNames(List<String> names) {
        return names.parallelStream()
                    .filter(name -> name.startsWith("A"))
                    .map(String::toUpperCase)
                    .collect(Collectors.toList()); 
                    // or .toList() in Java 16+
    }
}
```
