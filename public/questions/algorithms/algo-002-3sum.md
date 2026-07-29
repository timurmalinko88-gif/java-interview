---
id: algo-002
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Two Pointers
time_complexity: O(N^2)
space_complexity: O(1)
leetcode_id: 15
frequency: 98%
time: 15 min
tags: [Arrays, Two Pointers, Sorting, LeetCode 15]
---

# LeetCode 15: 3Sum

Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.

Notice that the solution set must not contain duplicate triplets.

### Constraints:
- `3 <= nums.length <= 3000`
- `-10^5 <= nums[i] <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

A naive brute-force search over all triplets (3 nested loops) results in O(N^3) time complexity, leading to `Time Limit Exceeded`.

**How to reduce 3Sum to 2Sum?**
If we sort the array `nums`, we can fix the first element `nums[i]` using an outer loop, and then search for the remaining pair `(nums[j] + nums[k])` using the **Two Pointers** pattern where the target sum is `target = -nums[i]`.

**Crucial Challenge: Handling Duplicate Triplets!**
The problem explicitly forbids duplicate triplets. Because the array is sorted, identical values are adjacent. We can avoid duplicates simply by skipping consecutive identical elements for the outer index `i`, as well as when shifting `left` and `right` pointers.


### ⚙️ Step-by-Step Visual Walkthrough

Consider array: `nums = [-1, 0, 1, 2, -1, -4]`

1. **Sort the array**:
   `nums = [-4, -1, -1, 0, 1, 2]`

2. **Iteration i = 0** (`nums[i] = -4`):
   - Search for two numbers summing to `+4`.
   - `left = 1 (-1)`, `right = 5 (2)`. Sum `-1 + 2 = 1 < 4` → `left++`.
   - Max possible sum here will not exceed `1 + 2 = 3 < 4`. No valid triplet found.

3. **Iteration i = 1** (`nums[i] = -1`):
   - Search for two numbers summing to `+1`.
   - `left = 2 (-1)`, `right = 5 (2)`. Sum `-1 + 2 = 1 == 1` → **Found triplet [-1, -1, 2]**!
   - Advance pointers, skip duplicates.
   - Next `left = 3 (0)`, `right = 4 (1)`. Sum `0 + 1 = 1 == 1` → **Found triplet [-1, 0, 1]**!

4. **Iteration i = 2** (`nums[i] = -1`):
   - The value `-1` is identical to `nums[i-1]`. Skip it to prevent duplicate triplets!


### ⚠️ Edge Cases & Pitfalls

- **Skipping Outer Duplicates**: Always check `if (i > 0 && nums[i] == nums[i - 1]) continue;`.
- **Skipping Pointer Duplicates**: After recording a valid triplet, increment `left` and decrement `right` while skipping matching elements:
  `while (left < right && nums[left] == nums[left + 1]) left++;`
- **Early Termination**: If `nums[i] > 0` after sorting, break early because three positive numbers can never sum to zero.


### 💻 Production Java Solution

```java
import java.util.*;

public class ThreeSum {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums); // O(N log N)

        for (int i = 0; i < nums.length - 2; i++) {
            // Early exit if smallest remaining element is > 0
            if (nums[i] > 0) break;

            // Skip duplicates for the first element
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int left = i + 1;
            int right = nums.length - 1;
            int target = -nums[i];

            while (left < right) {
                int sum = nums[left] + nums[right];

                if (sum == target) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));

                    // Skip duplicates for left and right pointers
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;

                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }

        return result;
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(N^2)
  Sorting takes O(N \log N). The outer loop runs $N$ times, and the two-pointer scan takes O(N) for each step. Total time is $O(N \log N) + O(N^2) = O(N^2)$.
- **Space Complexity**: O(1) or O(N)
  Auxiliary memory is O(1) excluding output list (or O(N) space required by `Arrays.sort()`).
