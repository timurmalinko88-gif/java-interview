---
id: algo-008
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Modified Binary Search
time_complexity: O(log N)
space_complexity: O(1)
leetcode_id: 33
frequency: 97%
time: 15 min
tags: [Binary Search, Arrays, LeetCode 33]
---

# LeetCode 33: Search in Rotated Sorted Array

There is an integer array `nums` sorted in ascending order (with distinct values) that is **rotated** at an unknown pivot index.

Given the array `nums` after rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.

You must write an algorithm with **$O(\log N)$ runtime complexity**.

### Constraints:
- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- All values of `nums` are unique.

---ANSWER---

### 💡 Intuition & Pattern Recognition

Standard Binary Search requires a fully sorted array.
When an array is rotated at a pivot point, **at least one half of the array (either left or right half) is guaranteed to remain strictly sorted**.

**Key Observation for Modified Binary Search:**
Calculate `mid = left + (right - left) / 2`.
1. Check if `nums[mid] == target`.
2. Determine which half is sorted:
   - If `nums[left] <= nums[mid]`, the **left half** `[left...mid]` is sorted.
   - Otherwise, the **right half** `[mid...right]` is sorted.
3. Check if `target` lies within the bounds of the sorted half:
   - If yes, narrow search to that half.
   - If no, search the opposite half.

---

### ⚙️ Step-by-Step Visual Walkthrough

Consider `nums = [4, 5, 6, 7, 0, 1, 2]`, `target = 0`.

1. `left = 0 (4)`, `right = 6 (2)`.
   - `mid = 3 (7)`.
   - `nums[left] (4) <= nums[mid] (7)` $\rightarrow$ Left half `[4, 5, 6, 7]` is sorted!
   - Is `target (0)` inside `[4..7]`? No (`target < 4`).
   - Therefore, `target` must be in the right half! Set `left = mid + 1 = 4`.

2. `left = 4 (0)`, `right = 6 (2)`.
   - `mid = 5 (1)`.
   - `nums[left] (0) <= nums[mid] (1)` $\rightarrow$ Left half `[0, 1]` is sorted!
   - Is `target (0)` inside `[0..1]`? Yes (`0 >= 0 && 0 <= 1`).
   - Search left half! Set `right = mid - 1 = 4`.

3. `left = 4`, `right = 4`.
   - `mid = 4`. `nums[mid] == 0 == target` $\rightarrow$ Return index `4`.

---

### ⚠️ Edge Cases & Pitfalls

- **Avoid Integer Overflow**: Calculate midpoint as `mid = left + (right - left) / 2` instead of `(left + right) / 2`.
- **Duplicates in Array**: If array had non-unique elements (LeetCode 81), `nums[left] == nums[mid]` would obscure which side is sorted, degrading worst-case to $O(N)$. For distinct values, it remains guaranteed $O(\log N)$.

---

### 💻 Production Java Solution

```java
public class SearchRotatedArray {
    public int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            }

            // Check if left half is sorted
            if (nums[left] <= nums[mid]) {
                // Check if target lies within sorted left range
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1; // Search left
                } else {
                    left = mid + 1;  // Search right
                }
            } 
            // Otherwise, right half must be sorted
            else {
                // Check if target lies within sorted right range
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;  // Search right
                } else {
                    right = mid - 1; // Search left
                }
            }
        }

        return -1; // Target not found
    }
}
```

---

### ⏱️ Time & Space Complexity

- **Time Complexity**: $O(\log N)$
  Each step halves the search space.
- **Space Complexity**: $O(1)$
  Iterative implementation uses constant memory.
