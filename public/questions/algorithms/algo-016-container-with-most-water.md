---
id: algo-016
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Two Pointers
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 11
frequency: 95%
time: 10 min
tags: [Arrays, Two Pointers, LeetCode 11]
---

# LeetCode 11: Container With Most Water

Given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.

### Constraints:
- `n == height.length`
- `2 <= n <= 10^5`
- `0 <= height[i] <= 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

To calculate the area between two pointers `left` and `right`:
`Area = min(height[left], height[right]) * (right - left)`

A brute force approach checks all pair combinations in O(N^2) time.
Since we want to maximize the area, we place `left` at index `0` and `right` at index `n - 1` to start with maximum width.

**Pointer Movement Decision Rule:**
The width decreases at every step. To potentially find a larger area, we MUST increase the height constraint `min(height[left], height[right])`.
Therefore, we always move the pointer pointing to the **shorter line**:
- If `height[left] < height[right]`: `left++`
- Else: `right--`

### ⚙️ Step-by-Step Visual Walkthrough

Consider `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`

1. `left = 0` (h=1), `right = 8` (h=7). Width = 8. Area = min(1, 7) * 8 = 8. MaxArea = 8.
   - `height[left]` (1) < `height[right]` (7) → Increment `left++`.
2. `left = 1` (h=8), `right = 8` (h=7). Width = 7. Area = min(8, 7) * 7 = 49. MaxArea = 49.
   - `height[left]` (8) > `height[right]` (7) → Decrement `right--`.
3. `left = 1` (h=8), `right = 6` (h=8). Width = 5. Area = min(8, 8) * 5 = 40. MaxArea = 49.
4. Continue moving pointers inwards until `left >= right`. Result: `49`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int maxArea(int[] height) {
        int maxArea = 0;
        int left = 0;
        int right = height.length - 1;

        while (left < right) {
            int currentWidth = right - left;
            int currentHeight = Math.min(height[left], height[right]);
            int currentArea = currentWidth * currentHeight;
            
            maxArea = Math.max(maxArea, currentArea);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxArea;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — single pass where pointers move towards each other until meeting.
- **Space Complexity:** O(1) — constant extra memory used for pointers and variables.

### 🎯 Key Takeaways & Interview Edge Cases

- **Why moving the taller pointer is useless:** Shrinking the width while keeping or reducing the limiting height can never yield a larger area.
- **Equal Heights Case:** When `height[left] == height[right]`, moving either pointer is safe because neither can form a larger container with the current limiting height.
