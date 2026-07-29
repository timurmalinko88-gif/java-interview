---
id: algo-022
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Junior
pattern: Dynamic Programming
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 53
frequency: 98%
time: 8 min
tags: [Arrays, Kadane's Algorithm, Dynamic Programming, LeetCode 53]
---

# LeetCode 53: Maximum Subarray

Given an integer array `nums`, find the contiguous subarray which has the largest sum and return *its sum*.

### Constraints:
- `1 <= nums.length <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

**Kadane's Algorithm:**
At each index `i`, we decide whether to add `nums[i]` to the existing subarray sum or start a new subarray at `nums[i]`:
`currentSum = max(nums[i], currentSum + nums[i])`

### ⚙️ Step-by-Step Visual Walkthrough

For `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`:
1. `i = 0` (-2): `curr = -2`, `max = -2`
2. `i = 1` (1): `curr = max(1, -1) = 1`, `max = 1`
3. `i = 3` (4): `curr = max(4, 2) = 4`, `max = 4`
4. `i = 6` (1): `curr = 6`, `max = 6` (`[4, -1, 2, 1]`)
Result: `6`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currentSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSoFar = Math.max(maxSoFar, currentSum);
        }

        return maxSoFar;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — single pass.
- **Space Complexity:** O(1) — constant memory.

### 🎯 Key Takeaways & Interview Edge Cases

- **All Negative Numbers:** Returns the maximum single element.
