---
id: algo-019
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Sliding Window
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 424
frequency: 91%
time: 12 min
tags: [Strings, Sliding Window, LeetCode 424]
---

# LeetCode 424: Longest Repeating Character Replacement

Given a string `s` and an integer `k`. You can replace up to `k` characters with any upper case character. Return the length of the longest substring containing the same letter.

### Constraints:
- `1 <= s.length <= 10^5`
- `0 <= k <= s.length`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Condition for valid window: `(windowSize - maxFrequency) <= k`
We track `maxFrequency` of any single character in the window. If replacements needed exceed `k`, shrink window from the left.

### ⚙️ Step-by-Step Visual Walkthrough

Consider `s = "AABABBA"`, `k = 1`:
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

- `maxCount` does not need to decrease on `left++` because only a larger `maxCount` can produce a longer valid window.
