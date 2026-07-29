---
id: algo-020
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Prefix Array
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 238
frequency: 97%
time: 10 min
tags: [Arrays, Prefix Array, LeetCode 238]
---

# LeetCode 238: Product of Array Except Self

Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all elements of `nums` except `nums[i]` without using division.

### Constraints:
- `2 <= nums.length <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Product except self = `(Prefix product left of i) * (Suffix product right of i)`.
Compute prefix products in `answer` in pass 1, then multiply by running suffix products in pass 2.

### ⚙️ Step-by-Step Visual Walkthrough

For `nums = [1, 2, 3, 4]`:
1. Prefix Pass: `[1, 1, 2, 6]`
2. Suffix Pass (backwards):
   - `i = 3`: `answer[3] = 6 * 1 = 6`, `suffix = 4`
   - `i = 2`: `answer[2] = 2 * 4 = 8`, `suffix = 12`
   - `i = 1`: `answer[1] = 1 * 12 = 12`, `suffix = 24`
   - `i = 0`: `answer[0] = 1 * 24 = 24`
3. Result: `[24, 12, 8, 6]`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        answer[0] = 1;
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1];
        }

        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= suffix;
            suffix *= nums[i];
        }

        return answer;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — two linear passes.
- **Space Complexity:** O(1) — output array is excluded from extra space constraint.

### 🎯 Key Takeaways & Interview Edge Cases

- **Multiple Zeros:** Produces all zeros output naturally.
