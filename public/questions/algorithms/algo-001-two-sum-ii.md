---
id: algo-001
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Junior
pattern: Two Pointers
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 167
frequency: 95%
time: 10 min
tags: [Arrays, Two Pointers, LeetCode 167]
---

# LeetCode 167: Two Sum II - Input Array Is Sorted

Given a 1-indexed array of integers `numbers` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific `target` number.

Return the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.

### Constraints:
- `2 <= numbers.length <= 3 * 10^4`
- `-1000 <= numbers[i] <= 1000`
- `numbers` is sorted in non-decreasing order.
- Exactly one valid solution exists. You may not use the same element twice.
- Your solution must use only $O(1)$ extra space.

---ANSWER---

### 💡 Intuition & Pattern Recognition

Why is a standard `HashMap` suboptimal here?
In the classic *Two Sum* problem, the input array is unsorted, requiring a `HashMap` to achieve $O(N)$ time at the cost of $O(N)$ auxiliary space.
However, here the input array is **already sorted**, and we are strictly required to use **$O(1)$ extra space**.

When an array is sorted and we need to find a pair satisfying a sum condition, the primary pattern is **Two Pointers**:
- Place `left` pointer at the start (smallest element).
- Place `right` pointer at the end (largest element).

**Pointer Movement Logic:**
1. If `numbers[left] + numbers[right] == target`, the solution is found.
2. If `currentSum < target`, the sum is too small. Increase the sum by advancing `left++` (towards larger numbers).
3. If `currentSum > target`, the sum is too large. Decrease the sum by retreating `right--` (towards smaller numbers).

---

### ⚙️ Step-by-Step Visual Walkthrough

Consider `numbers = [2, 7, 11, 15]`, `target = 9`.

1. **Initialization**:
   - `left = 0` (value `2`)
   - `right = 3` (value `15`)

2. **Iteration 1**:
   - `sum = 2 + 15 = 17`
   - `17 > 9` $\rightarrow$ Sum is too large. Decrement `right--`.
   - `right` becomes `2` (value `11`).

3. **Iteration 2**:
   - `sum = 2 + 11 = 13`
   - `13 > 9` $\rightarrow$ Sum is still too large. Decrement `right--`.
   - `right` becomes `1` (value `7`).

4. **Iteration 3**:
   - `sum = 2 + 7 = 9`
   - `9 == 9` $\rightarrow$ Match found! Return 1-based indices: `[left + 1, right + 1]` $\rightarrow$ `[1, 2]`.

---

### ⚠️ Edge Cases & Pitfalls

- **1-based Indexing**: The problem requires returning 1-based indices. Forgetting `+ 1` on index values is a common mistake.
- **Negative Numbers**: Sorted arrays can contain negative values (e.g., `[-3, -1, 0, 4]`). Two pointers handle negative numbers seamlessly because relative ordering is preserved.
- **Integer Overflow**: In edge cases where array elements approach `Integer.MAX_VALUE`, `numbers[left] + numbers[right]` might overflow. Casting to `long` during sum calculation avoids silent bugs.

---

### 💻 Production Java Solution

```java
public class TwoSumII {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;

        while (left < right) {
            int currentSum = numbers[left] + numbers[right];

            if (currentSum == target) {
                // Return 1-based indices as required
                return new int[]{left + 1, right + 1};
            } else if (currentSum < target) {
                left++; // Need a larger sum
            } else {
                right--; // Need a smaller sum
            }
        }

        throw new IllegalArgumentException("No two sum solution found");
    }
}
```

---

### ⏱️ Time & Space Complexity

- **Time Complexity**: $O(N)$
  Each step shrinks the distance between `left` and `right` by 1. In the worst case, we traverse the array once.
- **Space Complexity**: $O(1)$
  Only two pointer variables are allocated. No additional data structures are used.
