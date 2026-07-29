---
id: algo-047
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: Two Heaps
time_complexity: O(log N) add / O(1) find
space_complexity: O(N)
leetcode_id: 295
frequency: 96%
time: 15 min
tags: [Heap, Two Heaps, Design, LeetCode 295]
---

# LeetCode 295: Find Median from Data Stream

Design a data structure that supports adding numbers from a stream and returning the median of elements seen so far.

### Constraints:
- `-10^5 <= num <= 10^5`, up to `5 * 10^4` calls.

---ANSWER---

### 💡 Intuition & Pattern Recognition

Two Heaps Strategy:
1. Max-Heap `small` stores smaller half of elements.
2. Min-Heap `large` stores larger half of elements.
Maintain invariant: `small.size() == large.size()` or `small.size() == large.size() + 1`.

- `findMedian`:
  - If `small.size() > large.size()`, median = `small.peek()`.
  - Else median = `(small.peek() + large.peek()) / 2.0`.

### 💻 Production Java Implementation

```java
public class MedianFinder {
    private final PriorityQueue<Integer> small; // Max heap
    private final PriorityQueue<Integer> large; // Min heap

    public MedianFinder() {
        small = new PriorityQueue<>(Collections.reverseOrder());
        large = new PriorityQueue<>();
    }

    public void addNum(int num) {
        small.add(num);
        large.add(small.poll());

        if (small.size() < large.size()) {
            small.add(large.poll());
        }
    }

    public double findMedian() {
        if (small.size() > large.size()) {
            return small.peek();
        } else {
            return (small.peek() + large.peek()) / 2.0;
        }
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(log N) per `addNum`, O(1) `findMedian`.
- **Space Complexity:** O(N)
