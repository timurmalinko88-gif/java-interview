---
id: collections-048
topic: Collections
difficulty: Middle
format: Code Review
time: 5
frequency: 70%
source: Custom
prerequisites: ["Trees"]
tags: [oop, spring-core, stream-api, memory, collections]
---

# PriorityQueue Custom Comparator
How do you change a `PriorityQueue` from a min-heap to a max-heap in Java?

---ANSWER---

By default, a `PriorityQueue` in Java acts as a **min-heap**. It orders elements based on their natural ordering (using the `Comparable` interface), placing the smallest element at the head of the queue.

To change it into a **max-heap** (where the largest element is at the head), you must provide a custom `Comparator` via its constructor that reverses the natural ordering.

**Pre-Java 8 approach:**
```java
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(new Comparator<Integer>() {
    @Override
    public int compare(Integer a, Integer b) {
        return b.compareTo(a); // Reversed
    }
});
```

**Java 8+ modern approach:**
You can use the convenient static method `Collections.reverseOrder()` or the `Comparator.reverseOrder()` method.
```java
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
```

### Life Analogy
A default `PriorityQueue` (min-heap) is like a golf tournament leaderboard, where the player with the lowest score is placed at the very top. Passing a `Collections.reverseOrder()` comparator is like turning it into a basketball scoreboard, where the team with the highest score is placed at the top.

### Key Points
- Default is a min-heap (smallest at head).
- Requires a custom Comparator to become a max-heap.
- Use `Collections.reverseOrder()` for simplicity.
