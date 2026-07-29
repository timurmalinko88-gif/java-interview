---
id: algo-048
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: Monotonic Stack
time_complexity: O(N)
space_complexity: O(N)
leetcode_id: 84
frequency: 94%
time: 15 min
tags: [Arrays, Monotonic Stack, LeetCode 84]
---

# LeetCode 84: Largest Rectangle in Histogram

Given an array of integers `heights` representing the histogram's bar height where width of each bar is 1, return *the area of the largest rectangle in the histogram*.

### Constraints:
- `1 <= heights.length <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Monotonic Increasing Stack of indices:
When we see a bar `heights[i]` shorter than `heights[stack.peek()]`, bars in the stack cannot extend further right!
Pop index `h = heights[stack.pop()]`. Calculate width `w = stack.isEmpty() ? i : i - stack.peek() - 1`. Area = `h * w`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;
        int n = heights.length;

        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] > h) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }

        return maxArea;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — each index pushed and popped at most once.
- **Space Complexity:** O(N)
