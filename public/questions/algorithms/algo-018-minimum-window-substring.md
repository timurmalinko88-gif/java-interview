---
id: algo-018
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: Sliding Window
time_complexity: O(N + M)
space_complexity: O(1)
leetcode_id: 76
frequency: 94%
time: 15 min
tags: [Strings, Sliding Window, LeetCode 76]
---

# LeetCode 76: Minimum Window Substring

Given two strings `s` and `t` of lengths `m` and `n` respectively, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window.

### Constraints:
- `m == s.length`, `n == t.length`
- `1 <= m, n <= 10^5`

---ANSWER---

### 💡 Intuition & Pattern Recognition

This is the classic **Variable-Size Sliding Window**:
1. Build a character frequency map for `t`.
2. Expand `right` until all required characters are included in the window (`count == 0`).
3. Once valid, shrink `left` to minimize window length while maintaining validity.

### ⚙️ Step-by-Step Visual Walkthrough

For `s = "ADOBECODEBANC"`, `t = "ABC"`:
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

- **Duplicate Characters:** Frequency map naturally supports duplicate character constraints.
