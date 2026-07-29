---
id: algo-045
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Intervals
time_complexity: O(N log N)
space_complexity: O(1)
leetcode_id: 435
frequency: 90%
time: 10 min
tags: [Intervals, Greedy, LeetCode 435]
---

# LeetCode 435: Non-overlapping Intervals

Return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

### Constraints:
- `1 <= intervals.length <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Greedy Choice Property:
Sort intervals by **END time**.
To maximize non-overlapping intervals (and minimize removals), always pick the interval that finishes earliest!

### 💻 Production Java Implementation

```java
public class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;

        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        int count = 0;
        int prevEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < prevEnd) {
                count++; // Overlap detected -> remove current interval
            } else {
                prevEnd = intervals[i][1];
            }
        }

        return count;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N log N) — array sorting.
- **Space Complexity:** O(1)
