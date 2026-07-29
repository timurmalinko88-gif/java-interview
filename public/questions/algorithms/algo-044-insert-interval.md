---
id: algo-044
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Intervals
time_complexity: O(N)
space_complexity: O(N)
leetcode_id: 57
frequency: 93%
time: 10 min
tags: [Intervals, Arrays, LeetCode 57]
---

# LeetCode 57: Insert Interval

Insert `newInterval` into `intervals` (sorted by start time) such that `intervals` is still sorted and non-overlapping.

### Constraints:
- `0 <= intervals.length <= 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Three-Phase Linear Pass:
1. Add all intervals ending BEFORE `newInterval` starts (`interval[1] < newInterval[0]`).
2. Merge all overlapping intervals (`interval[0] <= newInterval[1]`) by extending `newInterval = [min(start), max(end)]`.
3. Add remaining intervals starting AFTER `newInterval` ends.

### 💻 Production Java Implementation

```java
public class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0, n = intervals.length;

        // Step 1: Add non-overlapping preceding intervals
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i++]);
        }

        // Step 2: Merge overlapping intervals
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);

        // Step 3: Add remaining intervals
        while (i < n) {
            result.add(intervals[i++]);
        }

        return result.toArray(new int[result.size()][]);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(N)
