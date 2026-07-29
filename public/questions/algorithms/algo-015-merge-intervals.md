---
id: algo-015
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Merge Intervals
time_complexity: O(N log N)
space_complexity: O(N)
leetcode_id: 56
frequency: 98%
time: 15 min
tags: [Arrays, Sorting, Intervals, LeetCode 56]
---

# LeetCode 56: Merge Intervals

Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Constraints:
- `1 <= intervals.length <= 10^4`
- `intervals[i].length == 2`
- `0 <= start_i <= end_i <= 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

If intervals are unsorted, checking for overlaps requires pairwise comparisons ($O(N^2)$).

When dealing with interval problems, sorting by start time `start_i` is almost always the first step:
1. Sort `intervals` by `start` time in ascending order ($O(N \log N)$).
2. Iterate through sorted intervals.
3. Compare current interval `[start, end]` with the last merged interval `[lastStart, lastEnd]` in our result list:
   - **Overlap Condition**: `start <= lastEnd`
     Merge them by updating `lastEnd = Math.max(lastEnd, end)`.
   - **No Overlap**: `start > lastEnd`
     Add current interval `[start, end]` as a new entry to result list.

---

### ⚙️ Step-by-Step Visual Walkthrough

Consider `intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]`.

1. **Sort**: Intervals already sorted by start time.
2. Initialize `resultList = [[1, 3]]`.
3. Process `[2, 6]`:
   - `start (2) <= lastEnd (3)` $\rightarrow$ **Overlap!**
   - Merge: `lastEnd = max(3, 6) = 6`.
   - `resultList` becomes `[[1, 6]]`.
4. Process `[8, 10]`:
   - `start (8) > lastEnd (6)` $\rightarrow$ No overlap.
   - Add `[8, 10]` to `resultList`. `[[1, 6], [8, 10]]`.
5. Process `[15, 18]`:
   - `start (15) > lastEnd (10)` $\rightarrow$ No overlap.
   - Add `[15, 18]` to `resultList`. `[[1, 6], [8, 10], [15, 18]]`.

---

### ⚠️ Edge Cases & Pitfalls

- **Subsumed Intervals**: e.g., `[[1, 4], [2, 3]]`. `lastEnd` must be `Math.max(4, 3) = 4` so `[2, 3]` doesn't shrink the merged interval `[1, 4]`.
- **Single Interval Input**: `intervals = [[1, 4]]` returns `[[1, 4]]`.
- **Comparator Syntax**: Sort using `Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));` to prevent potential integer subtraction overflow.

---

### 💻 Production Java Solution

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MergeIntervals {
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length <= 1) {
            return intervals;
        }

        // Sort intervals by start time ascending
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int[] currentInterval = intervals[0];
        merged.add(currentInterval);

        for (int[] interval : intervals) {
            int currentEnd = currentInterval[1];
            int nextStart = interval[0];
            int nextEnd = interval[1];

            if (nextStart <= currentEnd) {
                // Overlap: merge by expanding currentEnd
                currentInterval[1] = Math.max(currentEnd, nextEnd);
            } else {
                // No overlap: move to next interval
                currentInterval = interval;
                merged.add(currentInterval);
            }
        }

        return merged.toArray(new int[merged.size()][]);
    }
}
```

---

### ⏱️ Time & Space Complexity

- **Time Complexity**: $O(N \log N)$
  Sorting takes $O(N \log N)$ time. The subsequent linear pass takes $O(N)$.
- **Space Complexity**: $O(N)$
  `merged` list to store resulting intervals (or $O(N)$ space required by `Arrays.sort()`).
