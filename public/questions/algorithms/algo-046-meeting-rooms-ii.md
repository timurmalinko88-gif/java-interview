---
id: algo-046
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Intervals
time_complexity: O(N log N)
space_complexity: O(N)
leetcode_id: 253
frequency: 95%
time: 10 min
tags: [Intervals, Min-Heap, LeetCode 253]
---

# LeetCode 253: Meeting Rooms II

Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.

### Constraints:
- `1 <= intervals.length <= 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Sort meetings by **start time**.
Maintain a Min-Heap storing meeting **end times**:
- Top of heap represents room freeing up earliest.
- If `newMeeting.start >= minHeap.peek()`: room freed up! `minHeap.poll()`.
- Add `newMeeting.end` to heap.
Max size of heap = minimum conference rooms required!

### 💻 Production Java Implementation

```java
public class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;

        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int[] interval : intervals) {
            if (!minHeap.isEmpty() && interval[0] >= minHeap.peek()) {
                minHeap.poll();
            }
            minHeap.add(interval[1]);
        }

        return minHeap.size();
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N log N)
- **Space Complexity:** O(N)
