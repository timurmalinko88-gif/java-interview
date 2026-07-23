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

# Stream API side-effects antipatterns
A junior developer wrote a method to filter active users and collect their names into a list. They used Java Streams, but they modified an external list directly from within the `forEach` or `map` operations. When we changed the stream to `.parallelStream()` for performance, the resulting list started missing items and occasionally threw `ConcurrentModificationException`.

Can you explain why mutating external state inside a Stream is an anti-pattern and refactor the code to be safe and idiomatic?

---ANSWER---

The Java Stream API is designed around functional programming principles, which heavily discourage side effects. A side effect occurs when a function modifies state outside of its local environment. 

When you mutate an external collection (like an `ArrayList`) inside a `.forEach()` or `.map()` block, you are creating a thread-safety nightmare. `ArrayList` is not thread-safe. If the stream is executed in parallel (`.parallelStream()`), multiple threads will attempt to add elements to the list simultaneously. This leads to race conditions, lost updates, or `ConcurrentModificationException`.

The idiomatic and thread-safe way to accumulate results from a stream is to use terminal operations like `.collect(Collectors.toList())`. The `.collect()` method handles thread safety internally, even during parallel execution, by accumulating partial results in separate containers and combining them at the end.

### Examples
```java
// BUGGY CODE (Side effects in streams):
public List<String> getActiveUserNames(List<User> users) {
    List<String> activeNames = new ArrayList<>();
    
    users.parallelStream()
         .filter(User::isActive)
         .forEach(user -> {
             // ANTI-PATTERN: Mutating external state!
             // Not thread-safe under parallelStream!
             activeNames.add(user.getName()); 
         });
         
    return activeNames;
}

// REFACTORED CODE (Idiomatic Functional Style):
public List<String> getActiveUserNames(List<User> users) {
    return users.parallelStream()
                .filter(User::isActive)
                .map(User::getName) // Transform purely
                // Thread-safe accumulation
                .collect(Collectors.toList()); 
}
```

### Life Analogy
Buggy code is like having 5 chefs (parallel threads) all trying to throw chopped vegetables into a single small pot at the same time. Vegetables spill everywhere, and they bump heads (Concurrency errors).
Refactored code (`.collect()`) is like giving each of the 5 chefs their own cutting board. When they are all finished chopping, a head chef safely sweeps the vegetables from all 5 boards into the final pot. No spilling, no bumping heads.

### Key Points
- Avoid side effects inside lambda expressions passed to Stream operations.
- Never modify non-thread-safe external collections from within a parallel stream.
- Always use terminal operations like `.collect()`, `.reduce()`, or `.count()` to gather results idiomatically and safely.
