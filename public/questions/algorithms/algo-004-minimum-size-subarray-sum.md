---
id: algo-004
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Sliding Window
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 209
frequency: 90%
time: 12 min
tags: [Arrays, Sliding Window, Two Pointers, LeetCode 209]
---

# LeetCode 209: Minimum Size Subarray Sum

Given an array of positive integers `nums` and a positive integer `target`, return the **minimal length** of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return `0` instead.

### Constraints:
- `1 <= target <= 10^9`
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Brute-force requires inspecting all subarrays ($O(N^2)$ pairs), calculating sums ($O(N^3)$ or $O(N^2)$ with prefix sums).

Since all numbers in `nums` are **strictly positive**, adding an element to the window always increases the sum, and shrinking the window always decreases the sum. This monotonic property makes **Dynamic Sliding Window** the ideal pattern:
1. Expand `right` to increase `windowSum`.
2. As soon as `windowSum >= target`, attempt to shrink `left` as much as possible while maintaining `windowSum >= target`.
3. Record `minLen = Math.min(minLen, right - left + 1)`.

---

### ⚙️ Step-by-Step Visual Walkthrough

Consider `target = 7`, `nums = [2, 3, 1, 2, 4, 3]`.

1. Expand `right` pointers:
   - `right = 0 (2)` $\rightarrow$ `sum = 2`
   - `right = 1 (3)` $\rightarrow$ `sum = 5`
   - `right = 2 (1)` $\rightarrow$ `sum = 6`
   - `right = 3 (2)` $\rightarrow$ `sum = 8 >= 7`! Valid window `[2, 3, 1, 2]`, length = 4.

2. Shrink `left`:
   - Subtract `nums[left] (2)`, `left = 1`. `sum = 6 < 7`. Stop shrinking.

3. Expand `right = 4 (4)`:
   - `sum = 6 + 4 = 10 >= 7`! Valid window `[3, 1, 2, 4]`, length = 4.
   - Shrink `left = 1 (3)` $\rightarrow$ `sum = 7 >= 7`! Valid window `[1, 2, 4]`, length = 3.
   - Shrink `left = 2 (1)` $\rightarrow$ `sum = 6 < 7`. Stop shrinking.

4. Expand `right = 5 (3)`:
   - `sum = 6 + 3 = 9 >= 7`! Valid window `[2, 4, 3]`, length = 3.
   - Shrink `left = 3 (2)` $\rightarrow$ `sum = 7 >= 7`! Valid window `[4, 3]`, **length = 2**!

Final `minLen = 2`.

---

### ⚠️ Edge Cases & Pitfalls

- **No Subarray Sum Reaches Target**: If total sum of `nums < target`, return `0`.
- **Single Element Solution**: If any `nums[i] >= target`, min length is immediately `1`.
- **Negative Numbers**: Notice constraints state `nums[i] > 0`. If negative numbers were present, Sliding Window wouldn't work (requires Prefix Sums + Monotonic Deque).

---

### 💻 Production Java Solution

```java
public class MinSubArrayLen {
    public int minSubArrayLen(int target, int[] nums) {
        int minLen = Integer.MAX_VALUE;
        int windowSum = 0;
        int left = 0;

        for (int right = 0; right < nums.length; right++) {
            windowSum += nums[right];

            // Shrink window while target condition is satisfied
            while (windowSum >= target) {
                minLen = Math.min(minLen, right - left + 1);
                windowSum -= nums[left];
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? 0 : minLen;
    }
}
```

---

### ⏱️ Time & Space Complexity

- **Time Complexity**: $O(N)$
  Although there is a nested `while` loop, both `left` and `right` pointers move forward at most $N$ times. Each element is added and removed at most once.
- **Space Complexity**: $O(1)$
  Only primitive counter variables are used.
