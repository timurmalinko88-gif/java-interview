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
        "prompt": "Given an integer array `nums`, find a contiguous non-empty subarray within the array that has the largest product, and return *the product*.\n\n### Constraints:\n- `1 <= nums.length <= 2 * 10^4`\n- `-10 <= nums[i] <= 10`",
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

        int maxProd = nums[0];
        int minProd = nums[0];
        int result = nums[0];

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
        "prompt": "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return *its sum*.\n\n### Constraints:\n- `1 <= nums.length <= 10^5`\n- `-10^4 <= nums[i] <= 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

**Kadane's Algorithm:**
At each index `i`, we decide whether to add `nums[i]` to the existing subarray sum or start a new subarray at `nums[i]`:
`currentSum = max(nums[i], currentSum + nums[i])`

If `currentSum` drops below `0`, continuing the subarray is detrimental to future sums, so we reset.

### ⚙️ Step-by-Step Visual Walkthrough

For `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`:
1. `i = 0` (-2): `curr = -2`, `max = -2`
2. `i = 1` (1): `curr = max(1, -1) = 1`, `max = 1`
3. `i = 2` (-3): `curr = max(-3, -2) = -2`, `max = 1`
4. `i = 3` (4): `curr = max(4, 2) = 4`, `max = 4`
5. `i = 4` (-1): `curr = 3`, `max = 4`
6. `i = 5` (2): `curr = 5`, `max = 5`
7. `i = 6` (1): `curr = 6`, `max = 6` (`[4, -1, 2, 1]`)
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

- **All Negative Numbers:** Returns the maximum (least negative) single element correctly."""
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
        "prompt": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\n### Constraints:\n- `1 <= nums.length <= 2500`\n- `-10^4 <= nums[i] <= 10^4`",
        "answer": """### 💡 Intuition & Pattern Recognition

While 1D Dynamic Programming solves this in O(N^2), we can optimize to **O(N log N)** using **Patience Sorting / Binary Search**:
Maintain an active tails list `tails` where `tails[i]` stores the smallest tail of all increasing subsequences of length `i + 1`.

For each number `x` in `nums`:
- Binary search for `x` in `tails`.
- Replace the first element in `tails` that is `>= x` with `x`.
- If `x` is larger than all elements in `tails`, append `x` to `tails`.

### ⚙️ Step-by-Step Visual Walkthrough

For `nums = [10, 9, 2, 5, 3, 7, 101, 18]`:
1. `10` → `tails = [10]`
2. `9`  → `tails = [9]`
3. `2`  → `tails = [2]`
4. `5`  → `tails = [2, 5]`
5. `3`  → `tails = [2, 3]`
6. `7`  → `tails = [2, 3, 7]`
7. `101`→ `tails = [2, 3, 7, 101]`
8. `18` → `tails = [2, 3, 7, 18]`
Result: `tails.length = 4`.

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
                if (tails[mid] < x) {
                    i = mid + 1;
                } else {
                    j = mid;
                }
            }
            tails[i] = x;
            if (i == size) size++;
        }

        return size;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N log N) — N binary searches over `tails` of length at most N.
- **Space Complexity:** O(N) — array for tails storage.

### 🎯 Key Takeaways & Interview Edge Cases

- **Strictly Increasing:** `<` condition in binary search ensures duplicates replace equal elements rather than appending."""
    },
    # 024
    {
        "filename": "algo-024-word-break.md",
        "id": "algo-024",
        "title": "LeetCode 139: Word Break",
        "leetcode_id": "139",
        "difficulty": "Middle",
        "pattern": "Dynamic Programming",
        "time_complexity": "O(N * M * K)",
        "space_complexity": "O(N)",
        "frequency": "92%",
        "time": "12 min",
        "tags": ["Strings", "Dynamic Programming", "LeetCode 139"],
        "prompt": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\n### Constraints:\n- `1 <= s.length <= 300`\n- `1 <= wordDict.length <= 1000`",
        "answer": """### 💡 Intuition & Pattern Recognition

Let `dp[i]` be `true` if substring `s[0...i-1]` can be segmented into dictionary words.
Base case: `dp[0] = true` (empty string is valid).

**Transition Rule:**
For each position `i` from `1` to `n`, check all `j` from `0` to `i-1`:
`dp[i] = true` if `dp[j] == true` AND `s[j...i]` exists in `wordDict`.

### ⚙️ Step-by-Step Visual Walkthrough

For `s = \"leetcode\"`, `wordDict = [\"leet\", \"code\"]`:
1. `dp[0] = true`
2. `i = 4` (`\"leet\"`): `dp[0]` is true and `\"leet\"` is in dict → `dp[4] = true`.
3. `i = 8` (`\"leetcode\"`): `dp[4]` is true and `\"code\"` is in dict → `dp[8] = true`.
Result: `true`.

### 💻 Production Java Implementation

```java
public class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;

        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.contains(s.substring(j, i))) {
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

- **Time Complexity:** O(N^2 * K) — N^2 substring iterations with substring hashing.
- **Space Complexity:** O(N + M) — `dp` array and hash set.

### 🎯 Key Takeaways & Interview Edge Cases

- **HashSet Optimization:** Converting `wordDict` list to `HashSet` reduces lookup to O(1)."""
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
        "prompt": "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`.\n\n### Constraints:\n- `1 <= text1.length, text2.length <= 1000`",
        "answer": """### 💡 Intuition & Pattern Recognition

Let `dp[i][j]` be the length of the Longest Common Subsequence between `text1[0...i-1]` and `text2[0...j-1]`.

**Transitions:**
1. If `text1[i-1] == text2[j-1]`:
   `dp[i][j] = 1 + dp[i-1][j-1]` (matching character extends previous LCS)
2. Else:
   `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` (take best by excluding character from text1 or text2)

### ⚙️ Step-by-Step Visual Walkthrough

For `text1 = \"abcde\"`, `text2 = \"ace\"`:
- `'a' == 'a'` → `1 + dp[0][0] = 1`
- `'c' == 'c'` → `1 + dp[1][1] = 2`
- `'e' == 'e'` → `1 + dp[4][2] = 3`
Result: `3` (`\"ace\"`).

### 💻 Production Java Implementation

```java
public class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
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

- **Time Complexity:** O(M * N) — filling M x N grid.
- **Space Complexity:** O(M * N) — can be optimized to O(min(M, N)) space using two 1D rows.

### 🎯 Key Takeaways & Interview Edge Cases

- Subsequence vs Substring: Subsequences do not require contiguous memory."""
    }
]

print(f"Loaded {len(algos)} algorithm specs so far...")
