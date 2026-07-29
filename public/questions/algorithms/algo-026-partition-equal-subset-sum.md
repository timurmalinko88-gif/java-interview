---
id: algo-026
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Dynamic Programming
time_complexity: O(N * Target)
space_complexity: O(Target)
leetcode_id: 416
frequency: 89%
time: 12 min
tags: [Arrays, Dynamic Programming, 0/1 Knapsack, LeetCode 416]
---

# LeetCode 416: Partition Equal Subset Sum

Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.

### Constraints:
- `1 <= nums.length <= 200`
- `1 <= nums[i] <= 100`

---ANSWER---

### 💡 Intuition & Pattern Recognition

If the total sum of `nums` is odd, equal partition is impossible.
If total sum is even, problem reduces to 0/1 Knapsack: can we find a subset with `sum == totalSum / 2`?

Maintain boolean array `dp[target]`. Traverse elements in reverse to avoid reuse.

### ⚙️ Step-by-Step Visual Walkthrough

For `nums = [1, 5, 11, 5]`: `sum = 22`, `target = 11`.
- `num = 1`: `dp[1] = true`
- `num = 5`: `dp[6], dp[5] = true`
- `num = 11`: `dp[11] = true` -> Target achieved!
Result: `true`.

### 💻 Production Java Implementation

```java
public class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;

        if (sum % 2 != 0) return false;
        int target = sum / 2;

        boolean[] dp = new boolean[target + 1];
        dp[0] = true;

        for (int num : nums) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }

        return dp[target];
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N * Target)
- **Space Complexity:** O(Target)
