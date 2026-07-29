# coding=utf-8
import os

algos = [
    # 016
    {
        "filename": "algo-016-container-with-most-water.md",
        "id": "algo-016",
        "title": "LeetCode 11: Container With Most Water",
        "leetcode_id": "11",
        "difficulty": "Middle",
        "pattern": "Two Pointers",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "95%",
        "time": "10 min",
        "tags": ["Arrays", "Two Pointers", "LeetCode 11"],
        "prompt": "Given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn *the maximum amount of water a container can store*.\n\n### Constraints:\n- `n == height.length`\n- `2 <= n <= 10^5`\n- `0 <= height[i] <= 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

To calculate the area between two pointers `left` and `right`:
`Area = min(height[left], height[right]) * (right - left)`

A brute force approach checks all pair combinations in O(N^2) time.
Since we want to maximize the area, we place `left` at index `0` and `right` at index `n - 1` to start with maximum width.

**Pointer Movement Decision Rule:**
The width decreases at every step. To potentially find a larger area, we MUST increase the height constraint `min(height[left], height[right])`.
Therefore, we always move the pointer pointing to the **shorter line**:
- If `height[left] < height[right]`: `left++`
- Else: `right--`

### ⚙️ Step-by-Step Visual Walkthrough

Consider `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`

1. `left = 0` (h=1), `right = 8` (h=7). Width = 8. Area = min(1, 7) * 8 = 8. MaxArea = 8.
   - `height[left]` (1) < `height[right]` (7) → Increment `left++`.
2. `left = 1` (h=8), `right = 8` (h=7). Width = 7. Area = min(8, 7) * 7 = 49. MaxArea = 49.
   - `height[left]` (8) > `height[right]` (7) → Decrement `right--`.
3. `left = 1` (h=8), `right = 6` (h=8). Width = 5. Area = min(8, 8) * 5 = 40. MaxArea = 49.
4. Continue moving pointers inwards until `left >= right`. Result: `49`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int maxArea(int[] height) {
        int maxArea = 0;
        int left = 0;
        int right = height.length - 1;

        while (left < right) {
            int currentWidth = right - left;
            int currentHeight = Math.min(height[left], height[right]);
            int currentArea = currentWidth * currentHeight;
            
            maxArea = Math.max(maxArea, currentArea);

            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxArea;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — single pass where pointers move towards each other until meeting.
- **Space Complexity:** O(1) — constant extra memory used for pointers and variables.

### 🎯 Key Takeaways & Interview Edge Cases

- **Why moving the taller pointer is useless:** Shrinking the width while keeping or reducing the limiting height can never yield a larger area.
- **Equal Heights Case:** When `height[left] == height[right]`, moving either pointer is safe because neither can form a larger container with the current limiting height."""
    },
    # 017
    {
        "filename": "algo-017-trapping-rain-water.md",
        "id": "algo-017",
        "title": "LeetCode 42: Trapping Rain Water",
        "leetcode_id": "42",
        "difficulty": "Senior",
        "pattern": "Two Pointers",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "96%",
        "time": "15 min",
        "tags": ["Arrays", "Two Pointers", "Monotonic Stack", "LeetCode 42"],
        "prompt": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\n### Constraints:\n- `n == height.length`\n- `1 <= n <= 2 * 10^4`\n- `0 <= height[i] <= 10^5`",
        "answer": """### 💡 Intuition & Pattern Recognition

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
- **Stack Alternative:** Monotonic decreasing stack processes trapped water horizontally row-by-row."""
    },
    # 018
    {
        "filename": "algo-018-minimum-window-substring.md",
        "id": "algo-018",
        "title": "LeetCode 76: Minimum Window Substring",
        "leetcode_id": "76",
        "difficulty": "Senior",
        "pattern": "Sliding Window",
        "time_complexity": "O(N + M)",
        "space_complexity": "O(1)",
        "frequency": "94%",
        "time": "15 min",
        "tags": ["Strings", "Sliding Window", "LeetCode 76"],
        "prompt": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window.\n\n### Constraints:\n- `m == s.length`, `n == t.length`\n- `1 <= m, n <= 10^5`",
        "answer": """### 💡 Intuition & Pattern Recognition

This is the classic **Variable-Size Sliding Window**:
1. Build a character frequency map for `t`.
2. Expand `right` until all required characters are included in the window (`count == 0`).
3. Once valid, shrink `left` to minimize window length while maintaining validity.

### ⚙️ Step-by-Step Visual Walkthrough

For `s = \"ADOBECODEBANC\"`, `t = \"ABC\"`:
1. Frequency map: `{A:1, B:1, C:1}`, required count = 3.
2. Expand `right`: `"ADOBEC"` is valid (len = 6).
3. Contract `left`: `"DOBEC"` becomes invalid.
4. Expand `right` to `"CODEBA"`, contract to `"BANC"` (len = 4).
5. Result: `"BANC"`.

### 💻 Production Java Implementation

```java
public class Solution {
    public String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length()) return "";

        int[] map = new int[128];
        for (char c : t.toCharArray()) map[c]++;

        int count = t.length();
        int left = 0, right = 0;
        int minLen = Integer.MAX_VALUE, start = 0;

        while (right < s.length()) {
            char rChar = s.charAt(right);
            if (map[rChar] > 0) count--;
            map[rChar]--;
            right++;

            while (count == 0) {
                if (right - left < minLen) {
                    minLen = right - left;
                    start = left;
                }
                char lChar = s.charAt(left);
                map[lChar]++;
                if (map[lChar] > 0) count++;
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N + M) — linear scan over `s` and `t`.
- **Space Complexity:** O(1) — fixed 128-element ASCII frequency array.

### 🎯 Key Takeaways & Interview Edge Cases

- **Duplicate Characters:** Frequency map naturally supports duplicate character constraints."""
    },
    # 019
    {
        "filename": "algo-019-longest-repeating-character-replacement.md",
        "id": "algo-019",
        "title": "LeetCode 424: Longest Repeating Character Replacement",
        "leetcode_id": "424",
        "difficulty": "Middle",
        "pattern": "Sliding Window",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "91%",
        "time": "12 min",
        "tags": ["Strings", "Sliding Window", "LeetCode 424"],
        "prompt": "Given a string `s` and an integer `k`. You can replace up to `k` characters with any upper case character. Return the length of the longest substring containing the same letter.\n\n### Constraints:\n- `1 <= s.length <= 10^5`\n- `0 <= k <= s.length`",
        "answer": """### 💡 Intuition & Pattern Recognition

Condition for valid window: `(windowSize - maxFrequency) <= k`
We track `maxFrequency` of any single character in the window. If replacements needed exceed `k`, shrink window from the left.

### ⚙️ Step-by-Step Visual Walkthrough

Consider `s = \"AABABBA\"`, `k = 1`:
1. `"A"` → len 1, max 1. Valid.
2. `"AA"` → len 2, max 2. Valid.
3. `"AAB"` → len 3, max 2. Replacements = 1 <= 1. Valid.
4. `"AABA"` → len 4, max 3. Replacements = 1 <= 1. Valid. (Len = 4)
5. `"AABAB"` → len 5, max 3. Replacements = 2 > 1. Invalid → `left++`.
6. Result: `4`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int characterReplacement(String s, int k) {
        int[] counts = new int[26];
        int left = 0, maxCount = 0, maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            counts[c - 'A']++;
            maxCount = Math.max(maxCount, counts[c - 'A']);

            while ((right - left + 1) - maxCount > k) {
                counts[s.charAt(left) - 'A']--;
                left++;
            }

            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — each character visited twice at most.
- **Space Complexity:** O(1) — 26-element array.

### 🎯 Key Takeaways & Interview Edge Cases

- `maxCount` does not need to decrease on `left++` because only a larger `maxCount` can produce a longer valid window."""
    },
    # 020
    {
        "filename": "algo-020-product-of-array-except-self.md",
        "id": "algo-020",
        "title": "LeetCode 238: Product of Array Except Self",
        "leetcode_id": "238",
        "difficulty": "Middle",
        "pattern": "Prefix Array",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "97%",
        "time": "10 min",
        "tags": ["Arrays", "Prefix Array", "LeetCode 238"],
        "prompt": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all elements of `nums` except `nums[i]` without using division.\n\n### Constraints:\n- `2 <= nums.length <= 10^5`",
        "answer": """### 💡 Intuition & Pattern Recognition

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

- **Multiple Zeros:** Produces all zeros output naturally."""
    },
    # 021
    {
        "filename": "algo-021-maximum-product-subarray.md",
        "id": "algo-021",
        "title": "LeetCode 152: Maximum Product Subarray",
        "leetcode_id": "152",
        "difficulty": "Middle",
        "pattern": "Dynamic Programming",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "90%",
        "time": "12 min",
        "tags": ["Arrays", "Dynamic Programming", "LeetCode 152"],
        "prompt": "Given an integer array `nums`, find a contiguous non-empty subarray within the array that has the largest product, and return *the product*.\n\n### Constraints:\n- `1 <= nums.length <= 2 * 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

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

- **Zeros in Array:** Zero resets `maxProd` and `minProd` to 0, naturally restarting subarrays."""
    },
    # 022
    {
        "filename": "algo-022-maximum-subarray.md",
        "id": "algo-022",
        "title": "LeetCode 53: Maximum Subarray",
        "leetcode_id": "53",
        "difficulty": "Junior",
        "pattern": "Dynamic Programming",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "98%",
        "time": "8 min",
        "tags": ["Arrays", "Kadane's Algorithm", "Dynamic Programming", "LeetCode 53"],
        "prompt": "Given an integer array `nums`, find the contiguous subarray which has the largest sum and return *its sum*.\n\n### Constraints:\n- `1 <= nums.length <= 10^5`",
        "answer": """### 💡 Intuition & Pattern Recognition

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

- **All Negative Numbers:** Returns the maximum single element."""
    },
    # 023
    {
        "filename": "algo-023-longest-increasing-subsequence.md",
        "id": "algo-023",
        "title": "LeetCode 300: Longest Increasing Subsequence",
        "leetcode_id": "300",
        "difficulty": "Middle",
        "pattern": "Dynamic Programming",
        "time_complexity": "O(N log N)",
        "space_complexity": "O(N)",
        "frequency": "93%",
        "time": "12 min",
        "tags": ["Arrays", "Dynamic Programming", "Binary Search", "LeetCode 300"],
        "prompt": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\n### Constraints:\n- `1 <= nums.length <= 2500`",
        "answer": """### 💡 Intuition & Pattern Recognition

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
- **Space Complexity:** O(N)"""
    },
    # 024
    {
        "filename": "algo-024-word-break.md",
        "id": "algo-024",
        "title": "LeetCode 139: Word Break",
        "leetcode_id": "139",
        "difficulty": "Middle",
        "pattern": "Dynamic Programming",
        "time_complexity": "O(N^2)",
        "space_complexity": "O(N)",
        "frequency": "92%",
        "time": "12 min",
        "tags": ["Strings", "Dynamic Programming", "LeetCode 139"],
        "prompt": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\n### Constraints:\n- `1 <= s.length <= 300`",
        "answer": """### 💡 Intuition & Pattern Recognition

`dp[i]` is true if substring `s[0...i-1]` can be segmented into words.
`dp[i] = true` if `dp[j] == true` AND `s[j...i]` exists in `wordDict`.

### ⚙️ Step-by-Step Visual Walkthrough

For `s = \"leetcode\"`, `wordDict = [\"leet\", \"code\"]`:
`dp[0] = true` → `dp[4] = true` (`\"leet\"`) → `dp[8] = true` (`\"code\"`).
Result: `true`.

### 💻 Production Java Implementation

```java
public class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> set = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;

        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && set.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }

        return dp[s.length()];
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N^2 * K)
- **Space Complexity:** O(N + M)"""
    },
    # 025
    {
        "filename": "algo-025-longest-common-subsequence.md",
        "id": "algo-025",
        "title": "LeetCode 1143: Longest Common Subsequence",
        "leetcode_id": "1143",
        "difficulty": "Middle",
        "pattern": "Dynamic Programming",
        "time_complexity": "O(M * N)",
        "space_complexity": "O(M * N)",
        "frequency": "91%",
        "time": "12 min",
        "tags": ["Strings", "2D Dynamic Programming", "LeetCode 1143"],
        "prompt": "Given two strings `text1` and `text2`, return the length of their longest common subsequence.\n\n### Constraints:\n- `1 <= text1.length, text2.length <= 1000`",
        "answer": """### 💡 Intuition & Pattern Recognition

Let `dp[i][j]` be LCS length of `text1[0...i-1]` and `text2[0...j-1]`.
- If match: `dp[i][j] = 1 + dp[i-1][j-1]`
- Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

### ⚙️ Step-by-Step Visual Walkthrough

For `text1 = \"abcde\"`, `text2 = \"ace\"`:
Match 'a', match 'c', match 'e' → LCS = 3.

### 💻 Production Java Implementation

```java
public class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        return dp[m][n];
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(M * N)
- **Space Complexity:** O(M * N)"""
    },
    # 026
    {
        "filename": "algo-026-partition-equal-subset-sum.md",
        "id": "algo-026",
        "title": "LeetCode 416: Partition Equal Subset Sum",
        "leetcode_id": "416",
        "difficulty": "Middle",
        "pattern": "Dynamic Programming",
        "time_complexity": "O(N * Target)",
        "space_complexity": "O(Target)",
        "frequency": "89%",
        "time": "12 min",
        "tags": ["Arrays", "Dynamic Programming", "0/1 Knapsack", "LeetCode 416"],
        "prompt": "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.\n\n### Constraints:\n- `1 <= nums.length <= 200`\n- `1 <= nums[i] <= 100`",
        "answer": """### 💡 Intuition & Pattern Recognition

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
- **Space Complexity:** O(Target)"""
    },
    # 027
    {
        "filename": "algo-027-reverse-linked-list.md",
        "id": "algo-027",
        "title": "LeetCode 206: Reverse Linked List",
        "leetcode_id": "206",
        "difficulty": "Junior",
        "pattern": "Linked List",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "99%",
        "time": "5 min",
        "tags": ["Linked List", "Two Pointers", "LeetCode 206"],
        "prompt": "Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.\n\n### Constraints:\n- The number of nodes in the list is in the range `[0, 5000]`.\n- `-5000 <= Node.val <= 5000`",
        "answer": """### 💡 Intuition & Pattern Recognition

Maintain three pointers: `prev` (initialized to null), `curr` (initialized to head), and `nextTemp`.
Iteratively point `curr.next` to `prev`, then advance `prev` and `curr`.

### ⚙️ Step-by-Step Visual Walkthrough

`1 -> 2 -> 3 -> null`:
1. Save `next = 2`. Set `1.next = null`. `prev = 1`, `curr = 2`.
2. Save `next = 3`. Set `2.next = 1`. `prev = 2`, `curr = 3`.
3. Save `next = null`. Set `3.next = 2`. `prev = 3`, `curr = null`.
Result: `prev` points to head of `3 -> 2 -> 1 -> null`.

### 💻 Production Java Implementation

```java
public class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;

        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }

        return prev;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(1)"""
    },
    # 028
    {
        "filename": "algo-028-merge-two-sorted-lists.md",
        "id": "algo-028",
        "title": "LeetCode 21: Merge Two Sorted Lists",
        "leetcode_id": "21",
        "difficulty": "Junior",
        "pattern": "Linked List",
        "time_complexity": "O(N + M)",
        "space_complexity": "O(1)",
        "frequency": "97%",
        "time": "6 min",
        "tags": ["Linked List", "Two Pointers", "LeetCode 21"],
        "prompt": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one **sorted** list. Return *the head of the merged linked list*.\n\n### Constraints:\n- The number of nodes in both lists is in the range `[0, 50]`.",
        "answer": """### 💡 Intuition & Pattern Recognition

Use a dummy sentinel node `dummy` and a pointer `tail`.
Compare `list1.val` and `list2.val`, attach the smaller node to `tail.next`, and advance that list pointer.

### ⚙️ Step-by-Step Visual Walkthrough

`l1: 1 -> 2 -> 4`, `l2: 1 -> 3 -> 4`:
1. Compare 1 and 1 → attach l1(1). `l1` moves to 2.
2. Compare 2 and 1 → attach l2(1). `l2` moves to 3.
3. Compare 2 and 3 → attach l1(2). `l1` moves to 4.
4. Continue until merged. Result: `1 -> 1 -> 2 -> 3 -> 4 -> 4`.

### 💻 Production Java Implementation

```java
public class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }

        tail.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N + M)
- **Space Complexity:** O(1)"""
    },
    # 029
    {
        "filename": "algo-029-reorder-list.md",
        "id": "algo-029",
        "title": "LeetCode 143: Reorder List",
        "leetcode_id": "143",
        "difficulty": "Middle",
        "pattern": "Linked List",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "92%",
        "time": "12 min",
        "tags": ["Linked List", "Two Pointers", "LeetCode 143"],
        "prompt": "You are given the head of a singly linked list `L0 -> L1 -> ... -> Ln-1 -> Ln`.\n\nReorder the list to be: `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...` in-place.\n\n### Constraints:\n- `1 <= number of nodes <= 5 * 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

Three-Step Strategy:
1. Find middle of linked list using Fast & Slow pointers.
2. Reverse the second half of the linked list.
3. Interleave the first half and reversed second half nodes one by one.

### ⚙️ Step-by-Step Visual Walkthrough

For `1 -> 2 -> 3 -> 4 -> 5`:
1. Middle = `3`. Second half = `4 -> 5`.
2. Reverse second half: `5 -> 4`.
3. Interleave `1 -> 2 -> 3` and `5 -> 4`:
   `1 -> 5 -> 2 -> 4 -> 3`.

### 💻 Production Java Implementation

```java
public class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;

        // Step 1: Find middle
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Step 2: Reverse second half
        ListNode prev = null, curr = slow.next;
        slow.next = null; // Split lists
        while (curr != null) {
            ListNode tmp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = tmp;
        }

        // Step 3: Interleave
        ListNode first = head, second = prev;
        while (second != null) {
            ListNode tmp1 = first.next;
            ListNode tmp2 = second.next;

            first.next = second;
            second.next = tmp1;

            first = tmp1;
            second = tmp2;
        }
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(1)"""
    },
    # 030
    {
        "filename": "algo-030-remove-nth-node-from-end-of-list.md",
        "id": "algo-030",
        "title": "LeetCode 19: Remove Nth Node From End of List",
        "leetcode_id": "19",
        "difficulty": "Middle",
        "pattern": "Linked List",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "95%",
        "time": "10 min",
        "tags": ["Linked List", "Two Pointers", "LeetCode 19"],
        "prompt": "Given the `head` of a linked list, remove the `n`-th node from the end of the list and return its head.\n\n### Constraints:\n- `1 <= n <= size of list`",
        "answer": """### 💡 Intuition & Pattern Recognition

Two Pointers with Fixed Gap:
1. Advance `fast` pointer `n + 1` steps ahead.
2. Advance both `slow` and `fast` pointers together until `fast` reaches `null`.
3. `slow` will now point right before the target node to delete! `slow.next = slow.next.next`.

### ⚙️ Step-by-Step Visual Walkthrough

For `dummy -> 1 -> 2 -> 3 -> 4 -> 5`, `n = 2`:
1. Move `fast` 3 steps forward (points at `3`).
2. Move both until `fast` is `null`: `slow` points at `3`.
3. `3.next = 5`.
Result: `1 -> 2 -> 3 -> 5`.

### 💻 Production Java Implementation

```java
public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode slow = dummy;
        ListNode fast = dummy;

        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        while (fast != null) {
            slow = slow.next;
            fast = fast.next;
        }

        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — single pass.
- **Space Complexity:** O(1)"""
    },
    # 031
    {
        "filename": "algo-031-merge-k-sorted-lists.md",
        "id": "algo-031",
        "title": "LeetCode 23: Merge k Sorted Lists",
        "leetcode_id": "23",
        "difficulty": "Senior",
        "pattern": "Heap / Priority Queue",
        "time_complexity": "O(N log K)",
        "space_complexity": "O(K)",
        "frequency": "96%",
        "time": "15 min",
        "tags": ["Linked List", "Heap", "PriorityQueue", "LeetCode 23"],
        "prompt": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.\n\n### Constraints:\n- `k == lists.length`, `0 <= k <= 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

Min-Heap (PriorityQueue):
1. Insert the head of each non-null linked list into Min-Heap ordered by node value.
2. Extract the minimum node from the heap, attach to merged list.
3. If extracted node has a `.next`, push `.next` into the heap.

### ⚙️ Step-by-Step Visual Walkthrough

`l1: 1->4->5`, `l2: 1->3->4`, `l3: 2->6`:
1. Min-Heap initialized with `[1(l1), 1(l2), 2(l3)]`.
2. Extract 1(l1), attach to tail. Push 4(l1). Heap: `[1(l2), 2(l3), 4(l1)]`.
3. Extract 1(l2), attach to tail. Push 3(l2).
4. Continue until heap empty. Result: `1->1->2->3->4->4->5->6`.

### 💻 Production Java Implementation

```java
public class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;

        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));

        for (ListNode node : lists) {
            if (node != null) pq.add(node);
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (!pq.isEmpty()) {
            ListNode minNode = pq.poll();
            tail.next = minNode;
            tail = tail.next;

            if (minNode.next != null) {
                pq.add(minNode.next);
            }
        }

        return dummy.next;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N log K) — N total nodes across K lists.
- **Space Complexity:** O(K) — Heap size at most K."""
    },
    # 032
    {
        "filename": "algo-032-binary-tree-maximum-path-sum.md",
        "id": "algo-032",
        "title": "LeetCode 124: Binary Tree Maximum Path Sum",
        "leetcode_id": "124",
        "difficulty": "Senior",
        "pattern": "Tree DFS",
        "time_complexity": "O(N)",
        "space_complexity": "O(H)",
        "frequency": "94%",
        "time": "15 min",
        "tags": ["Tree", "DFS", "Recursion", "LeetCode 124"],
        "prompt": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. A node can only appear in the sequence at most once. Return *the maximum path sum of any non-empty path*.\n\n### Constraints:\n- Number of nodes in range `[1, 3 * 10^4]`",
        "answer": """### 💡 Intuition & Pattern Recognition

For any node `u` in a DFS traversal:
1. Max branch sum extending upwards = `node.val + max(0, max(leftGain, rightGain))`
2. Max path sum passing THROUGH node `u` as root of sub-path = `node.val + max(0, leftGain) + max(0, rightGain)`

We update a global `maxSum` with option 2 at every node, while returning option 1 to parent recursive calls.

### ⚙️ Step-by-Step Visual Walkthrough

For tree: `[-10, 9, 20, null, null, 15, 7]`:
1. Node 15: returns 15.
2. Node 7: returns 7.
3. Node 20: path sum through 20 = 20 + 15 + 7 = 42. Global max = 42. Returns `20 + max(15, 7) = 35`.
4. Node 9: returns 9.
5. Root -10: path sum through root = -10 + 9 + 35 = 34. Global max stays 42.
Result: `42`.

### 💻 Production Java Implementation

```java
public class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        maxGain(root);
        return maxSum;
    }

    private int maxGain(TreeNode node) {
        if (node == null) return 0;

        int leftGain = Math.max(maxGain(node.left), 0);
        int rightGain = Math.max(maxGain(node.right), 0);

        int currentPathSum = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentPathSum);

        return node.val + Math.max(leftGain, rightGain);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — visits each node once.
- **Space Complexity:** O(H) — recursion stack height."""
    },
    # 033
    {
        "filename": "algo-033-serialize-and-deserialize-binary-tree.md",
        "id": "algo-033",
        "title": "LeetCode 297: Serialize and Deserialize Binary Tree",
        "leetcode_id": "297",
        "difficulty": "Senior",
        "pattern": "BFS / DFS",
        "time_complexity": "O(N)",
        "space_complexity": "O(N)",
        "frequency": "95%",
        "time": "15 min",
        "tags": ["Tree", "DFS", "Design", "LeetCode 297"],
        "prompt": "Design an algorithm to serialize and deserialize a binary tree. Serialization is the process of converting a data structure into a sequence of bits or string.\n\n### Constraints:\n- Number of nodes in range `[0, 10^4]`",
        "answer": """### 💡 Intuition & Pattern Recognition

Pre-order DFS traversal with `\"X\"` marker for null nodes:
- `serialize`: Traverses root, left, right. Converts to comma-separated string `\"1,2,X,X,3,4,X,X,5,X,X\"`.
- `deserialize`: Converts string to Queue/List and reconstructs tree recursively reading left to right.

### 💻 Production Java Implementation

```java
public class Codec {

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("X," );
        } else {
            sb.append(node.val).append("," );
            buildString(node.left, sb);
            buildString(node.right, sb);
        }
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split("," )));
        return buildTree(nodes);
    }

    private TreeNode buildTree(Queue<String> nodes) {
        String val = nodes.poll();
        if (val.equals("X" )) return null;

        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — linear pass during both encoding and decoding.
- **Space Complexity:** O(N) — queue storage."""
    },
    # 034
    {
        "filename": "algo-034-kth-smallest-element-in-a-bst.md",
        "id": "algo-034",
        "title": "LeetCode 230: Kth Smallest Element in a BST",
        "leetcode_id": "230",
        "difficulty": "Middle",
        "pattern": "Tree DFS",
        "time_complexity": "O(H + K)",
        "space_complexity": "O(H)",
        "frequency": "91%",
        "time": "10 min",
        "tags": ["Tree", "BST", "Inorder Traversal", "LeetCode 230"],
        "prompt": "Given the `root` of a binary search tree and an integer `k`, return *the `k`-th smallest value (1-indexed) of all the values of the nodes in the tree*.\n\n### Constraints:\n- `1 <= k <= number of nodes <= 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

In-order traversal (Left -> Node -> Right) of a Binary Search Tree visits node values in **strictly sorted ascending order**.
Perform iterative or recursive In-order traversal and decrement `k` at each visited node. When `k == 0`, return current node value!

### 💻 Production Java Implementation

```java
public class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;

        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }

            curr = stack.pop();
            k--;
            if (k == 0) return curr.val;

            curr = curr.right;
        }

        return -1;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(H + K) — stops as soon as k-th node is reached.
- **Space Complexity:** O(H) — stack depth equal to tree height."""
    },
    # 035
    {
        "filename": "algo-035-validate-binary-search-tree.md",
        "id": "algo-035",
        "title": "LeetCode 98: Validate Binary Search Tree",
        "leetcode_id": "98",
        "difficulty": "Middle",
        "pattern": "Tree DFS",
        "time_complexity": "O(N)",
        "space_complexity": "O(H)",
        "frequency": "96%",
        "time": "10 min",
        "tags": ["Tree", "BST", "DFS", "LeetCode 98"],
        "prompt": "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).\n\n### Constraints:\n- Number of nodes in range `[1, 10^4]`",
        "answer": """### 💡 Intuition & Pattern Recognition

A valid BST requires that for every node `u`:
- ALL nodes in `u.left` subtree must be strictly `< u.val`.
- ALL nodes in `u.right` subtree must be strictly `> u.val`.

Pass valid range bounds `(min, max)` down during recursive DFS traversal.

### 💻 Production Java Implementation

```java
public class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private boolean validate(TreeNode node, Integer min, Integer max) {
        if (node == null) return true;

        if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
            return false;
        }

        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(H)"""
    },
    # 036
    {
        "filename": "algo-036-implement-trie-prefix-tree.md",
        "id": "algo-036",
        "title": "LeetCode 208: Implement Trie (Prefix Tree)",
        "leetcode_id": "208",
        "difficulty": "Middle",
        "pattern": "Trie",
        "time_complexity": "O(L) per operation",
        "space_complexity": "O(Alphabet * L * N)",
        "frequency": "95%",
        "time": "12 min",
        "tags": ["Trie", "Design", "LeetCode 208"],
        "prompt": "Implement the `Trie` class with `insert`, `search`, and `startsWith` methods.\n\n### Constraints:\n- `1 <= word.length, prefix.length <= 2000`",
        "answer": """### 💡 Intuition & Pattern Recognition

A Trie node contains:
- An array `children = new TrieNode[26]` for child pointers ('a' through 'z').
- A boolean flag `isEndOfWord`.

### 💻 Production Java Implementation

```java
public class Trie {

    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    private final TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) {
                curr.children[idx] = new TrieNode();
            }
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }

    private TrieNode find(String str) {
        TrieNode curr = root;
        for (char c : str.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return null;
            curr = curr.children[idx];
        }
        return curr;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(L) for insert/search/startsWith where L is string length.
- **Space Complexity:** O(26 * L * N)"""
    },
    # 037
    {
        "filename": "algo-037-design-add-and-search-words-data-structure.md",
        "id": "algo-037",
        "title": "LeetCode 211: Design Add and Search Words Data Structure",
        "leetcode_id": "211",
        "difficulty": "Middle",
        "pattern": "Trie",
        "time_complexity": "O(L) insert / O(26^L) search with dots",
        "space_complexity": "O(Trie size)",
        "frequency": "90%",
        "time": "12 min",
        "tags": ["Trie", "DFS", "Design", "LeetCode 211"],
        "prompt": "Design a data structure that supports adding new words and finding if a string matches any previously added string. Dots `'.'` match any letter.\n\n### Constraints:\n- `1 <= word.length <= 25`",
        "answer": """### 💡 Intuition & Pattern Recognition

Trie + Recursive DFS:
When encountering a regular letter `c`, follow `curr.children[c - 'a']`.
When encountering wildcard `'.'`: branch and search all 26 non-null child nodes recursively!

### 💻 Production Java Implementation

```java
public class WordDictionary {

    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    private final TrieNode root;

    public WordDictionary() {
        root = new TrieNode();
    }

    public void addWord(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        return searchInNode(word, 0, root);
    }

    private boolean searchInNode(String word, int index, TrieNode node) {
        if (node == null) return false;
        if (index == word.length()) return node.isEnd;

        char c = word.charAt(index);
        if (c == '.') {
            for (TrieNode child : node.children) {
                if (child != null && searchInNode(word, index + 1, child)) {
                    return true;
                }
            }
            return false;
        } else {
            return searchInNode(word, index + 1, node.children[c - 'a']);
        }
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(L) without wildcards, worst-case O(26^L) with all dots.
- **Space Complexity:** O(Trie size)"""
    },
    # 038
    {
        "filename": "algo-038-word-search-ii.md",
        "id": "algo-038",
        "title": "LeetCode 212: Word Search II",
        "leetcode_id": "212",
        "difficulty": "Senior",
        "pattern": "Trie",
        "time_complexity": "O(M * N * 3^L)",
        "space_complexity": "O(Words Total Chars)",
        "frequency": "93%",
        "time": "15 min",
        "tags": ["Trie", "Backtracking", "Matrix", "LeetCode 212"],
        "prompt": "Given an `m x n` `board` of characters and a list of strings `words`, return *all words on the board*.\n\n### Constraints:\n- `m == board.length`, `n == board[i].length`\n- `1 <= m, n <= 12`",
        "answer": """### 💡 Intuition & Pattern Recognition

Trie + Grid DFS Backtracking:
1. Insert all dictionary words into a Trie. Store full `word` reference inside leaf TrieNodes for O(1) collection.
2. Run Backtracking DFS from every cell `(r, c)`.
3. Pruning: If current grid character is not in current TrieNode's children, backtrack immediately!

### 💻 Production Java Implementation

```java
public class Solution {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        String word = null;
    }

    public List<String> findWords(char[][] board, String[] words) {
        List<String> result = new ArrayList<>();
        TrieNode root = buildTrie(words);

        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                dfs(board, r, c, root, result);
            }
        }

        return result;
    }

    private void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {
        char ch = board[r][c];
        if (ch == '#' || node.children[ch - 'a'] == null) return;

        node = node.children[ch - 'a'];
        if (node.word != null) {
            result.add(node.word);
            node.word = null; // Prevent duplicate additions
        }

        board[r][c] = '#'; // Mark visited
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
                dfs(board, nr, nc, node, result);
            }
        }

        board[r][c] = ch; // Restore visited
    }

    private TrieNode buildTrie(String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode curr = root;
            for (char c : w.toCharArray()) {
                int idx = c - 'a';
                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
                curr = curr.children[idx];
            }
            curr.word = w;
        }
        return root;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(M * N * 3^L) where L is max word length.
- **Space Complexity:** O(Words Total Characters)"""
    },
    # 039
    {
        "filename": "algo-039-course-schedule.md",
        "id": "algo-039",
        "title": "LeetCode 207: Course Schedule",
        "leetcode_id": "207",
        "difficulty": "Middle",
        "pattern": "Graph Topological Sort",
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V + E)",
        "frequency": "96%",
        "time": "12 min",
        "tags": ["Graph", "Topological Sort", "BFS", "LeetCode 207"],
        "prompt": "There are `numCourses` courses you have to take, labeled `0` to `numCourses - 1`. Prerequisites are given as `prerequisites[i] = [a, b]` meaning you must take course `b` first before `a`.\n\nReturn `true` if you can finish all courses.\n\n### Constraints:\n- `1 <= numCourses <= 2000`",
        "answer": """### 💡 Intuition & Pattern Recognition

Kahn's Algorithm (Topological Sort BFS):
1. Build adjacency list graph and `inDegree` array tracking incoming edge counts per node.
2. Enqueue all nodes with `inDegree == 0` (courses with no prerequisites).
3. Process queue: decrement `inDegree` of neighbors. If neighbor's `inDegree` becomes 0, enqueue it.
4. If processed count == `numCourses`, valid DAG! Else graph contains a cycle.

### 💻 Production Java Implementation

```java
public class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[numCourses];

        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());

        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.add(i);
        }

        int count = 0;
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            count++;

            for (int neighbor : graph.get(curr)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) queue.add(neighbor);
            }
        }

        return count == numCourses;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(V + E) — visits every vertex and edge once.
- **Space Complexity:** O(V + E) — graph storage."""
    },
    # 040
    {
        "filename": "algo-040-course-schedule-ii.md",
        "id": "algo-040",
        "title": "LeetCode 210: Course Schedule II",
        "leetcode_id": "210",
        "difficulty": "Middle",
        "pattern": "Graph Topological Sort",
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V + E)",
        "frequency": "93%",
        "time": "12 min",
        "tags": ["Graph", "Topological Sort", "BFS", "LeetCode 210"],
        "prompt": "Return the ordering of courses you should take to finish all courses. If impossible, return an empty array.\n\n### Constraints:\n- `1 <= numCourses <= 2000`",
        "answer": """### 💡 Intuition & Pattern Recognition

Kahn's Algorithm returning topological order array:
Identical to Course Schedule I, but store each dequeued course into an `order` result array.

### 💻 Production Java Implementation

```java
public class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[numCourses];

        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());

        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.add(i);
        }

        int[] order = new int[numCourses];
        int index = 0;

        while (!queue.isEmpty()) {
            int curr = queue.poll();
            order[index++] = curr;

            for (int neighbor : graph.get(curr)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) queue.add(neighbor);
            }
        }

        return index == numCourses ? order : new int[0];
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(V + E)
- **Space Complexity:** O(V + E)"""
    },
    # 041
    {
        "filename": "algo-041-clone-graph.md",
        "id": "algo-041",
        "title": "LeetCode 133: Clone Graph",
        "leetcode_id": "133",
        "difficulty": "Middle",
        "pattern": "BFS / DFS",
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V)",
        "frequency": "91%",
        "time": "10 min",
        "tags": ["Graph", "BFS", "DFS", "LeetCode 133"],
        "prompt": "Given a reference of a node in a connected undirected graph, return a **deep copy** (clone) of the graph.\n\n### Constraints:\n- Number of nodes in graph is in range `[0, 100]`.",
        "answer": """### 💡 Intuition & Pattern Recognition

HashMap `visited` mapping `originalNode -> clonedNode`.
Use BFS or DFS to traverse graph. For each node, clone it, store in map, and recursively clone neighbor pointers.

### 💻 Production Java Implementation

```java
public class Solution {
    private final Map<Node, Node> visited = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;

        if (visited.containsKey(node)) {
            return visited.get(node);
        }

        Node clone = new Node(node.val, new ArrayList<>());
        visited.put(node, clone);

        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(cloneGraph(neighbor));
        }

        return clone;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(V + E)
- **Space Complexity:** O(V)"""
    },
    # 042
    {
        "filename": "algo-042-alien-dictionary.md",
        "id": "algo-042",
        "title": "LeetCode 269: Alien Dictionary",
        "leetcode_id": "269",
        "difficulty": "Senior",
        "pattern": "Graph Topological Sort",
        "time_complexity": "O(C)",
        "space_complexity": "O(1)",
        "frequency": "88%",
        "time": "15 min",
        "tags": ["Graph", "Topological Sort", "LeetCode 269"],
        "prompt": "There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you. You are given a list of strings `words` sorted lexicographically by the rules of this new language. Return a string of the unique letters in the alien language sorted in lexicographically increasing order. If invalid, return `\"\"`.\n\n### Constraints:\n- `1 <= words.length <= 100`",
        "answer": """### 💡 Intuition & Pattern Recognition

1. Build DAG character graph: Compare adjacent words `w1` and `w2`. First differing character `w1[i] != w2[i]` defines directed edge `w1[i] -> w2[i]`.
2. Invalid prefix check: If `w2` is prefix of `w1` (e.g. `\"abc\"` before `\"ab\"`), order is invalid!
3. Perform Topological Sort (Kahn's or DFS). If output length != total unique characters, graph contains cycle.

### 💻 Production Java Implementation

```java
public class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> graph = new HashMap<>();
        Map<Character, Integer> inDegree = new HashMap<>();

        for (String w : words) {
            for (char c : w.toCharArray()) {
                inDegree.putIfAbsent(c, 0);
                graph.putIfAbsent(c, new HashSet<>());
            }
        }

        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i], w2 = words[i + 1];
            if (w1.length() > w2.length() && w1.startsWith(w2)) return "";

            for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {
                char c1 = w1.charAt(j), c2 = w2.charAt(j);
                if (c1 != c2) {
                    if (!graph.get(c1).contains(c2)) {
                        graph.get(c1).add(c2);
                        inDegree.put(c2, inDegree.get(c2) + 1);
                    }
                    break;
                }
            }
        }

        Queue<Character> queue = new LinkedList<>();
        for (char c : inDegree.keySet()) {
            if (inDegree.get(c) == 0) queue.add(c);
        }

        StringBuilder sb = new StringBuilder();
        while (!queue.isEmpty()) {
            char c = queue.poll();
            sb.append(c);
            for (char neighbor : graph.get(c)) {
                inDegree.put(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) == 0) queue.add(neighbor);
            }
        }

        return sb.length() == inDegree.size() ? sb.toString() : "";
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(C) total characters.
- **Space Complexity:** O(1) — at most 26 lowercase English letters."""
    },
    # 043
    {
        "filename": "algo-043-pacific-atlantic-water-flow.md",
        "id": "algo-043",
        "title": "LeetCode 417: Pacific Atlantic Water Flow",
        "leetcode_id": "417",
        "difficulty": "Middle",
        "pattern": "BFS / DFS",
        "time_complexity": "O(M * N)",
        "space_complexity": "O(M * N)",
        "frequency": "89%",
        "time": "12 min",
        "tags": ["Graph", "BFS", "DFS", "LeetCode 417"],
        "prompt": "Return a 2D list of grid coordinates where water can flow to both the Pacific (top/left) and Atlantic (bottom/right) oceans.\n\n### Constraints:\n- `m == heights.length`, `n == heights[i].length`\n- `1 <= m, n <= 200`",
        "answer": """### 💡 Intuition & Pattern Recognition

Reverse Flow DFS/BFS:
Instead of simulating water flowing downhill from every cell, start from ocean borders and flow **uphill**:
- Run DFS from Pacific edges (top & left).
- Run DFS from Atlantic edges (bottom & right).
Intersection of both reachable boolean grids is the answer!

### 💻 Production Java Implementation

```java
public class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        List<List<Integer>> res = new ArrayList<>();
        if (heights == null || heights.length == 0) return res;

        int m = heights.length, n = heights[0].length;
        boolean[][] pacific = new boolean[m][n];
        boolean[][] atlantic = new boolean[m][n];

        for (int i = 0; i < m; i++) {
            dfs(heights, pacific, i, 0, heights[i][0]);
            dfs(heights, atlantic, i, n - 1, heights[i][n - 1]);
        }

        for (int j = 0; j < n; j++) {
            dfs(heights, pacific, 0, j, heights[0][j]);
            dfs(heights, atlantic, m - 1, j, heights[m - 1][j]);
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (pacific[i][j] && atlantic[i][j]) {
                    res.add(Arrays.asList(i, j));
                }
            }
        }

        return res;
    }

    private void dfs(int[][] heights, boolean[][] ocean, int r, int c, int prevHeight) {
        if (r < 0 || r >= heights.length || c < 0 || c >= heights[0].length) return;
        if (ocean[r][c] || heights[r][c] < prevHeight) return;

        ocean[r][c] = true;
        dfs(heights, ocean, r + 1, c, heights[r][c]);
        dfs(heights, ocean, r - 1, c, heights[r][c]);
        dfs(heights, ocean, r, c + 1, heights[r][c]);
        dfs(heights, ocean, r, c - 1, heights[r][c]);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(M * N)
- **Space Complexity:** O(M * N)"""
    },
    # 044
    {
        "filename": "algo-044-insert-interval.md",
        "id": "algo-044",
        "title": "LeetCode 57: Insert Interval",
        "leetcode_id": "57",
        "difficulty": "Middle",
        "pattern": "Intervals",
        "time_complexity": "O(N)",
        "space_complexity": "O(N)",
        "frequency": "93%",
        "time": "10 min",
        "tags": ["Intervals", "Arrays", "LeetCode 57"],
        "prompt": "Insert `newInterval` into `intervals` (sorted by start time) such that `intervals` is still sorted and non-overlapping.\n\n### Constraints:\n- `0 <= intervals.length <= 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

Three-Phase Linear Pass:
1. Add all intervals ending BEFORE `newInterval` starts (`interval[1] < newInterval[0]`).
2. Merge all overlapping intervals (`interval[0] <= newInterval[1]`) by extending `newInterval = [min(start), max(end)]`.
3. Add remaining intervals starting AFTER `newInterval` ends.

### 💻 Production Java Implementation

```java
public class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0, n = intervals.length;

        // Step 1: Add non-overlapping preceding intervals
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i++]);
        }

        // Step 2: Merge overlapping intervals
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);

        // Step 3: Add remaining intervals
        while (i < n) {
            result.add(intervals[i++]);
        }

        return result.toArray(new int[result.size()][]);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(N)"""
    },
    # 045
    {
        "filename": "algo-045-non-overlapping-intervals.md",
        "id": "algo-045",
        "title": "LeetCode 435: Non-overlapping Intervals",
        "leetcode_id": "435",
        "difficulty": "Middle",
        "pattern": "Intervals",
        "time_complexity": "O(N log N)",
        "space_complexity": "O(1)",
        "frequency": "90%",
        "time": "10 min",
        "tags": ["Intervals", "Greedy", "LeetCode 435"],
        "prompt": "Return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.\n\n### Constraints:\n- `1 <= intervals.length <= 10^5`",
        "answer": """### 💡 Intuition & Pattern Recognition

Greedy Choice Property:
Sort intervals by **END time**.
To maximize non-overlapping intervals (and minimize removals), always pick the interval that finishes earliest!

### 💻 Production Java Implementation

```java
public class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;

        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        int count = 0;
        int prevEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < prevEnd) {
                count++; // Overlap detected -> remove current interval
            } else {
                prevEnd = intervals[i][1];
            }
        }

        return count;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N log N) — array sorting.
- **Space Complexity:** O(1)"""
    },
    # 046
    {
        "filename": "algo-046-meeting-rooms-ii.md",
        "id": "algo-046",
        "title": "LeetCode 253: Meeting Rooms II",
        "leetcode_id": "253",
        "difficulty": "Middle",
        "pattern": "Intervals",
        "time_complexity": "O(N log N)",
        "space_complexity": "O(N)",
        "frequency": "95%",
        "time": "10 min",
        "tags": ["Intervals", "Min-Heap", "LeetCode 253"],
        "prompt": "Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.\n\n### Constraints:\n- `1 <= intervals.length <= 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

Sort meetings by **start time**.
Maintain a Min-Heap storing meeting **end times**:
- Top of heap represents room freeing up earliest.
- If `newMeeting.start >= minHeap.peek()`: room freed up! `minHeap.poll()`.
- Add `newMeeting.end` to heap.
Max size of heap = minimum conference rooms required!

### 💻 Production Java Implementation

```java
public class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;

        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int[] interval : intervals) {
            if (!minHeap.isEmpty() && interval[0] >= minHeap.peek()) {
                minHeap.poll();
            }
            minHeap.add(interval[1]);
        }

        return minHeap.size();
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N log N)
- **Space Complexity:** O(N)"""
    },
    # 047
    {
        "filename": "algo-047-find-median-from-data-stream.md",
        "id": "algo-047",
        "title": "LeetCode 295: Find Median from Data Stream",
        "leetcode_id": "295",
        "difficulty": "Senior",
        "pattern": "Two Heaps",
        "time_complexity": "O(log N) add / O(1) find",
        "space_complexity": "O(N)",
        "frequency": "96%",
        "time": "15 min",
        "tags": ["Heap", "Two Heaps", "Design", "LeetCode 295"],
        "prompt": "Design a data structure that supports adding numbers from a stream and returning the median of elements seen so far.\n\n### Constraints:\n- `-10^5 <= num <= 10^5`, up to `5 * 10^4` calls.",
        "answer": """### 💡 Intuition & Pattern Recognition

Two Heaps Strategy:
1. Max-Heap `small` stores smaller half of elements.
2. Min-Heap `large` stores larger half of elements.
Maintain invariant: `small.size() == large.size()` or `small.size() == large.size() + 1`.

- `findMedian`:
  - If `small.size() > large.size()`, median = `small.peek()`.
  - Else median = `(small.peek() + large.peek()) / 2.0`.

### 💻 Production Java Implementation

```java
public class MedianFinder {
    private final PriorityQueue<Integer> small; // Max heap
    private final PriorityQueue<Integer> large; // Min heap

    public MedianFinder() {
        small = new PriorityQueue<>(Collections.reverseOrder());
        large = new PriorityQueue<>();
    }

    public void addNum(int num) {
        small.add(num);
        large.add(small.poll());

        if (small.size() < large.size()) {
            small.add(large.poll());
        }
    }

    public double findMedian() {
        if (small.size() > large.size()) {
            return small.peek();
        } else {
            return (small.peek() + large.peek()) / 2.0;
        }
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(log N) per `addNum`, O(1) `findMedian`.
- **Space Complexity:** O(N)"""
    },
    # 048
    {
        "filename": "algo-048-largest-rectangle-in-histogram.md",
        "id": "algo-048",
        "title": "LeetCode 84: Largest Rectangle in Histogram",
        "leetcode_id": "84",
        "difficulty": "Senior",
        "pattern": "Monotonic Stack",
        "time_complexity": "O(N)",
        "space_complexity": "O(N)",
        "frequency": "94%",
        "time": "15 min",
        "tags": ["Arrays", "Monotonic Stack", "LeetCode 84"],
        "prompt": "Given an array of integers `heights` representing the histogram's bar height where width of each bar is 1, return *the area of the largest rectangle in the histogram*.\n\n### Constraints:\n- `1 <= heights.length <= 10^5`",
        "answer": """### 💡 Intuition & Pattern Recognition

Monotonic Increasing Stack of indices:
When we see a bar `heights[i]` shorter than `heights[stack.peek()]`, bars in the stack cannot extend further right!
Pop index `h = heights[stack.pop()]`. Calculate width `w = stack.isEmpty() ? i : i - stack.peek() - 1`. Area = `h * w`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;
        int n = heights.length;

        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] > h) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }

        return maxArea;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — each index pushed and popped at most once.
- **Space Complexity:** O(N)"""
    },
    # 049
    {
        "filename": "algo-049-best-time-to-buy-and-sell-stock.md",
        "id": "algo-049",
        "title": "LeetCode 121: Best Time to Buy and Sell Stock",
        "leetcode_id": "121",
        "difficulty": "Junior",
        "pattern": "Two Pointers",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "frequency": "99%",
        "time": "5 min",
        "tags": ["Arrays", "Two Pointers", "Dynamic Programming", "LeetCode 121"],
        "prompt": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. Return maximum profit.\n\n### Constraints:\n- `1 <= prices.length <= 10^5`",
        "answer": """### 💡 Intuition & Pattern Recognition

Track minimum buy price `minPrice` so far. For each price `p`, potential profit = `p - minPrice`.
Update max profit found.

### 💻 Production Java Implementation

```java
public class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }

        return maxProfit;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(1)"""
    },
    # 050
    {
        "filename": "algo-050-word-search.md",
        "id": "algo-050",
        "title": "LeetCode 79: Word Search",
        "leetcode_id": "79",
        "difficulty": "Middle",
        "pattern": "Backtracking",
        "time_complexity": "O(N * M * 3^L)",
        "space_complexity": "O(L)",
        "frequency": "95%",
        "time": "12 min",
        "tags": ["Matrix", "Backtracking", "DFS", "LeetCode 79"],
        "prompt": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.\n\n### Constraints:\n- `m == board.length`, `n == board[i].length`, `1 <= m, n <= 6`",
        "answer": """### 💡 Intuition & Pattern Recognition

Backtracking DFS:
1. Iterate over every grid cell `(r, c)`.
2. If `board[r][c] == word[0]`, start DFS.
3. Mark visited cell temporarily (e.g. `board[r][c] = '#'`), recursively check 4 directions, then restore cell.

### 💻 Production Java Implementation

```java
public class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;

        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (dfs(board, word, 0, r, c)) return true;
            }
        }

        return false;
    }

    private boolean dfs(char[][] board, String word, int idx, int r, int c) {
        if (idx == word.length()) return true;
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return false;
        if (board[r][c] != word.charAt(idx)) return false;

        char temp = board[r][c];
        board[r][c] = '#'; // Mark visited

        boolean found = dfs(board, word, idx + 1, r + 1, c) ||
                        dfs(board, word, idx + 1, r - 1, c) ||
                        dfs(board, word, idx + 1, r, c + 1) ||
                        dfs(board, word, idx + 1, r, c - 1);

        board[r][c] = temp; // Restore
        return found;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N * M * 3^L)
- **Space Complexity:** O(L) — recursion stack depth."""
    }
]

print(f"Generating total of {len(algos)} algorithm breakdown files...")
target_dir = os.path.join("public", "questions", "algorithms")
os.makedirs(target_dir, exist_ok=True)

for item in algos:
    filepath = os.path.join(target_dir, item["filename"])
    content = f"""---
id: {item['id']}
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: {item['difficulty']}
pattern: {item['pattern']}
time_complexity: {item['time_complexity']}
space_complexity: {item['space_complexity']}
leetcode_id: {item['leetcode_id']}
frequency: {item['frequency']}
time: {item['time']}
tags: [{', '.join(item['tags'])}]
---

# {item['title']}

{item['prompt']}

---ANSWER---

{item['answer']}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Successfully generated all {len(algos)} markdown files in {target_dir}.")
