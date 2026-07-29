# coding=utf-8
import os

algos = [
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
- **Equal Heights Case:** When `height[left] == height[right]`, moving either pointer (or both) is safe because neither can form a larger container with the current limiting height."""
    },
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

Water trapped at index `i` is determined by the minimum of the highest wall to its left and the highest wall to its right:
`water[i] = min(maxLeft, maxRight) - height[i]`

Instead of precomputing prefix/suffix max arrays in O(N) space, we can maintain two pointers `left` and `right`, along with running trackers `leftMax` and `rightMax`.

**Two-Pointer Rule:**
At any step, if `leftMax < rightMax`, the amount of water trapped at `left` is bottlenecked solely by `leftMax`. We can calculate water at `left` immediately and increment `left++`. Otherwise, water at `right` is bottlenecked by `rightMax`, so we calculate water at `right` and decrement `right--`.

### ⚙️ Step-by-Step Visual Walkthrough

Consider `height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`

1. `left = 0`, `right = 11`, `leftMax = 0`, `rightMax = 1`.
2. `height[left] < height[right]` → Process left. `leftMax = max(0, 0) = 0`. Water += 0 - 0 = 0. `left++` (1).
3. `left = 1` (h=1), `leftMax = 1`. Water += 0. `left++` (2).
4. `left = 2` (h=0). `leftMax = 1`. Water += 1 - 0 = 1. Total Water = 1. `left++`.
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

- **Time Complexity:** O(N) — single pass with two pointers.
- **Space Complexity:** O(1) — constant auxiliary space.

### 🎯 Key Takeaways & Interview Edge Cases

- **Empty / Flat array:** Returns `0` if array length < 3 or heights are monotonically increasing/decreasing.
- **Monotonic Stack Alternative:** Monotonic stack solves the problem horizontally row-by-row, which is useful when asked for bounding indices of water pools."""
    },
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
        "tags": ["Strings", "Sliding Window", "Hash Table", "LeetCode 76"],
        "prompt": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\n### Constraints:\n- `m == s.length`, `n == t.length`\n- `1 <= m, n <= 10^5`\n- `s` and `t` consist of uppercase and lowercase English letters.",
        "answer": """### 💡 Intuition & Pattern Recognition

This is a classic **Variable-Size Sliding Window** problem:
1. Maintain a frequency map `need` of characters in `t`.
2. Expand the `right` pointer of the window until all character requirements are met (`formed == required`).
3. Once valid, contract the `left` pointer to shrink the window while maintaining validity, updating the minimum window length found so far.

### ⚙️ Step-by-Step Visual Walkthrough

Consider `s = \"ADOBECODEBANC\"`, `t = \"ABC\"`

1. Count frequency in `t`: `{A:1, B:1, C:1}`. Required unique chars = 3.
2. Expand `right` until substring contains A, B, C:
   - Window `"ADOBEC"` contains A, B, C! Length = 6 (`"ADOBEC"`).
3. Contract `left`:
   - Shrink `"ADOBEC"` → `"DOBEC"` (invalid, lost 'A').
4. Expand `right` further to `"CODEBA"` -> shrink to `"BECODEBA"`.
5. Eventually `right` reaches end and window contracts to `"BANC"` (Length = 4).
6. Result: `"BANC"`.

### 💻 Production Java Implementation

```java
public class Solution {
    public String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length()) return "";

        int[] map = new int[128];
        for (char c : t.toCharArray()) {
            map[c]++;
        }

        int count = t.length();
        int left = 0, right = 0;
        int minLen = Integer.MAX_VALUE;
        int startIndex = 0;

        while (right < s.length()) {
            char chRight = s.charAt(right);
            if (map[chRight] > 0) {
                count--;
            }
            map[chRight]--;
            right++;

            while (count == 0) {
                if (right - left < minLen) {
                    minLen = right - left;
                    startIndex = left;
                }

                char chLeft = s.charAt(left);
                map[chLeft]++;
                if (map[chLeft] > 0) {
                    count++;
                }
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? "" : s.substring(startIndex, startIndex + minLen);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N + M) — each character in `s` is processed at most twice (once by `right`, once by `left`).
- **Space Complexity:** O(1) — fixed 128-sized ASCII integer array.

### 🎯 Key Takeaways & Interview Edge Cases

- **Duplicate characters in `t`:** The frequency array naturally tracks duplicate character counts.
- **No valid window:** Handled by initializing `minLen` to `Integer.MAX_VALUE` and returning `""` if unchanged."""
    },
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
        "prompt": "You are given a string `s` consisting of only uppercase English letters and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\nReturn *the length of the longest substring containing the same letter you can get after performing the above operations*.\n\n### Constraints:\n- `1 <= s.length <= 10^5`\n- `s` consists of only uppercase English letters.\n- `0 <= k <= s.length` ",
        "answer": """### 💡 Intuition & Pattern Recognition

For any window of size `windowSize = right - left + 1`:
The number of replacements needed to make all characters in the window identical is:
`replacementsNeeded = windowSize - maxFrequency`

where `maxFrequency` is the frequency of the most dominant character in the current window.

**Sliding Window Strategy:**
- If `windowSize - maxFreq <= k`, the window is valid. Expand `right`.
- If `windowSize - maxFreq > k`, the window is invalid. Shrink by advancing `left++`.

### ⚙️ Step-by-Step Visual Walkthrough

Consider `s = \"AABABBA\"`, `k = 1`

1. `left = 0`, `right = 0`: `"A"` (maxFreq = 1). Valid. Length = 1.
2. `right = 1`: `"AA"` (maxFreq = 2). Valid. Length = 2.
3. `right = 2`: `"AAB"` (maxFreq = 2, len = 3). Replacements = 3 - 2 = 1 <= 1. Valid. Length = 3.
4. `right = 3`: `"AABA"` (maxFreq = 3, len = 4). Replacements = 4 - 3 = 1 <= 1. Valid. Length = 4.
5. `right = 4`: `"AABAB"` (maxFreq = 3, len = 5). Replacements = 5 - 3 = 2 > 1. Invalid! Shrink `left++`.
6. Final Max Length = `4` (`"AABA"` -> `"AAAA"`).

### 💻 Production Java Implementation

```java
public class Solution {
    public int characterReplacement(String s, int k) {
        int[] counts = new int[26];
        int left = 0;
        int maxCount = 0;
        int maxLength = 0;

        for (int right = 0; right < s.length(); right++) {
            char curr = s.charAt(right);
            counts[curr - 'A']++;
            maxCount = Math.max(maxCount, counts[curr - 'A']);

            // If replacements exceed k, shrink window
            while ((right - left + 1) - maxCount > k) {
                counts[s.charAt(left) - 'A']--;
                left++;
            }

            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — single pass through string with `left` and `right` pointers.
- **Space Complexity:** O(1) — 26-element array for alphabet counts.

### 🎯 Key Takeaways & Interview Edge Cases

- **Why `maxCount` does not need to decrease when shrinking `left`:** A smaller `maxCount` would only create smaller window candidates, which cannot beat the maximum length recorded so far."""
    },
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
        "prompt": "Given an integer array `nums`, return *an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`*.\n\nThe algorithm must run in O(N) time and **without using the division operation**.\n\n### Constraints:\n- `2 <= nums.length <= 10^5`\n- `-30 <= nums[i] <= 30`\n- The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.",
        "answer": """### 💡 Intuition & Pattern Recognition

For any index `i`, the product of all elements except `nums[i]` is:
`answer[i] = (product of all numbers to the left of i) * (product of all numbers to the right of i)`

Instead of using two separate prefix and suffix arrays (O(N) space), we can compute prefix products directly into the `answer` array in a left-to-right pass, and then multiply by suffix products in a right-to-left pass using a single `runningSuffixProduct` variable.

### ⚙️ Step-by-Step Visual Walkthrough

Consider `nums = [1, 2, 3, 4]`

1. **Pass 1 (Prefix Product from left to right):**
   - `answer[0] = 1`
   - `answer[1] = 1 * nums[0] = 1`
   - `answer[2] = 1 * nums[1] = 2`
   - `answer[3] = 2 * nums[2] = 6`
   - `answer` state: `[1, 1, 2, 6]`

2. **Pass 2 (Suffix Product from right to left):**
   - Initialize `suffix = 1`
   - `i = 3`: `answer[3] *= 1` → `6`, `suffix *= nums[3]` → `4`
   - `i = 2`: `answer[2] *= 4` → `8`, `suffix *= nums[2]` → `12`
   - `i = 1`: `answer[1] *= 12` → `12`, `suffix *= nums[1]` → `24`
   - `i = 0`: `answer[0] *= 24` → `24`
   - Final `answer`: `[24, 12, 8, 6]`.

### 💻 Production Java Implementation

```java
public class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        // Step 1: Compute prefix products
        answer[0] = 1;
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1];
        }

        // Step 2: Compute suffix products on the fly
        int suffixProduct = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] = answer[i] * suffixProduct;
            suffixProduct *= nums[i];
        }

        return answer;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — two linear passes.
- **Space Complexity:** O(1) — output array does not count as extra space per problem specifications.

### 🎯 Key Takeaways & Interview Edge Cases

- **Zeros in Array:** Handles single zero or multiple zeros automatically without `ArithmeticException` (division by zero)."""
    }
]

print(f"Generating {len(algos)} algorithm breakdown markdown files...")
for item in algos:
    filepath = os.path.join("public", "questions", "algorithms", item["filename"])
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

print("Batch 1 written successfully.")
