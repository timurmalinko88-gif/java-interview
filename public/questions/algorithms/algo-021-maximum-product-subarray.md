---
id: algo-021
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Dynamic Programming
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 152
frequency: 90%
time: 12 min
tags: [Arrays, Dynamic Programming, LeetCode 152]
---

# LeetCode 152: Maximum Product Subarray

Given an integer array `nums`, find a contiguous non-empty subarray within the array that has the largest product, and return *the product*.

### Constraints:
- `1 <= nums.length <= 2 * 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Because multiplying two negative numbers yields a positive product, a very small negative number can become the maximum positive product when multiplied by another negative number.

We maintain both **`maxProd`** and **`minProd`** at each step:
When `nums[i] < 0`, `maxProd` and `minProd` swap places!

### ⚙️ Step-by-Step Visual Walkthrough

For `nums = [2, 3, -2, 4]`:
1. `i = 0` (2): `max = 2`, `min = 2`, `ans = 2`
2. `i = 1` (3): `max = 6`, `min = 3`, `ans = 6`
3. `i = 2` (-2): negative! swap max/min. `max = max(-2, 3*-2) = -2`, `min = min(-2, 6*-2) = -12`, `ans = 6`
4. `i = 3` (4): `max = max(4, -2*4) = 4`, `min = min(4, -12*4) = -48`, `ans = 6`
Result: `6`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int maxProduct(int[] nums) {
        if (nums == null || nums.length == 0) return 0;

        int maxProd = nums[0], minProd = nums[0], result = nums[0];

        for (int i = 1; i < nums.length; i++) {
            int curr = nums[i];
            if (curr < 0) {
                int temp = maxProd;
                maxProd = minProd;
                minProd = temp;
            }

            maxProd = Math.max(curr, maxProd * curr);
            minProd = Math.min(curr, minProd * curr);

            result = Math.max(result, maxProd);
        }

        return result;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — single linear pass.
- **Space Complexity:** O(1) — constant space.

### 🎯 Key Takeaways & Interview Edge Cases

- **Zeros in Array:** Zero resets `maxProd` and `minProd` to 0, naturally restarting subarrays.
