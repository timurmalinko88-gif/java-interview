---
id: algo-017
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: Two Pointers
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 42
frequency: 96%
time: 15 min
tags: [Arrays, Two Pointers, Monotonic Stack, LeetCode 42]
---

# LeetCode 42: Trapping Rain Water

Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Constraints:
- `n == height.length`
- `1 <= n <= 2 * 10^4`
- `0 <= height[i] <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Water trapped at index `i` is determined by: `water[i] = min(maxLeft, maxRight) - height[i]`

Instead of precomputing prefix and suffix max arrays in O(N) space, we maintain `left` and `right` pointers along with running trackers `leftMax` and `rightMax`.

**Two-Pointer Decision Rule:**
If `leftMax < rightMax`, the water level at `left` is bottlenecked solely by `leftMax`. We process `left` and increment `left++`. Otherwise, we process `right` and decrement `right--`.

### ⚙️ Step-by-Step Visual Walkthrough

Consider `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`

1. `left = 0`, `right = 11`, `leftMax = 0`, `rightMax = 1`.
2. `height[left] < height[right]` → Process left. `leftMax = max(0, 0) = 0`. Water += 0. `left++`.
3. `left = 1` (h=1), `leftMax = 1`. Water += 0. `left++`.
4. `left = 2` (h=0). `leftMax = 1`. Water += (1 - 0) = 1. `left++`.
5. Continue until `left == right`. Total Trapped Water = `6`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int trap(int[] height) {
        if (height == null || height.length == 0) return 0;

        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int totalWater = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    totalWater += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    totalWater += rightMax - height[right];
                }
                right--;
            }
        }

        return totalWater;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — single linear pass.
- **Space Complexity:** O(1) — zero auxiliary data structures.

### 🎯 Key Takeaways & Interview Edge Cases

- **Flat / Monotonic Terrain:** Handled gracefully returning `0`.
- **Stack Alternative:** Monotonic decreasing stack processes trapped water horizontally row-by-row.
