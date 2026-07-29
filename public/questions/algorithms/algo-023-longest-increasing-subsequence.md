---
id: algo-023
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Dynamic Programming
time_complexity: O(N log N)
space_complexity: O(N)
leetcode_id: 300
frequency: 93%
time: 12 min
tags: [Arrays, Dynamic Programming, Binary Search, LeetCode 300]
---

# LeetCode 300: Longest Increasing Subsequence

Given an integer array `nums`, return the length of the longest strictly increasing subsequence.

### Constraints:
- `1 <= nums.length <= 2500`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Patience Sorting + Binary Search:
Maintain array `tails` where `tails[i]` stores smallest tail of all increasing subsequences of length `i+1`.

For each `x` in `nums`:
Binary search `x` in `tails`. Replace first element `>= x` with `x`, or append `x`.

### ⚙️ Step-by-Step Visual Walkthrough

For `nums = [10, 9, 2, 5, 3, 7, 101, 18]`:
`tails`: `[10]` → `[9]` → `[2]` → `[2, 5]` → `[2, 3]` → `[2, 3, 7]` → `[2, 3, 7, 101]` → `[2, 3, 7, 18]`.
Result: `4`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;

        for (int x : nums) {
            int i = 0, j = size;
            while (i < j) {
                int mid = (i + j) / 2;
                if (tails[mid] < x) i = mid + 1;
                else j = mid;
            }
            tails[i] = x;
            if (i == size) size++;
        }

        return size;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N log N)
- **Space Complexity:** O(N)
