---
id: algo-003
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Sliding Window
time_complexity: O(N)
space_complexity: O(min(N, M))
leetcode_id: 3
frequency: 99%
time: 15 min
tags: [Strings, Sliding Window, Hash Table, LeetCode 3]
---

# LeetCode 3: Longest Substring Without Repeating Characters

Given a string `s`, find the length of the **longest substring** without repeating characters.

### Constraints:
- `0 <= s.length <= 5 * 10^4`
- `s` consists of English letters, digits, symbols and spaces.

---ANSWER---

### 💡 Intuition & Pattern Recognition

A brute-force approach checks every substring ($O(N^2)$ substrings, $O(N)$ validation $\rightarrow O(N^3)$ total).

When searching for a contiguous subarray or substring that satisfies a dynamic constraint (e.g. all unique characters), the optimal pattern is **Sliding Window**:
- Maintain a window `[left, right]`.
- As `right` expands, add `s.charAt(right)` to a frequency map or `HashMap<Character, Integer>` recording the latest index of each character.
- If a duplicate character is encountered, shrink the window by jumping `left = Math.max(left, map.get(ch) + 1)` directly past the duplicate.
- Update `maxLength = Math.max(maxLength, right - left + 1)`.

---

### ⚙️ Step-by-Step Visual Walkthrough

Consider `s = "abcabcbb"`.

1. **`right = 0`, `ch = 'a'`**:
   - `map` doesn't contain `'a'`.
   - `map.put('a', 0)`, `left = 0`.
   - `maxLength = 1` (`"a"`).

2. **`right = 1`, `ch = 'b'`**:
   - `map.put('b', 1)`, `left = 0`.
   - `maxLength = 2` (`"ab"`).

3. **`right = 2`, `ch = 'c'`**:
   - `map.put('c', 2)`, `left = 0`.
   - `maxLength = 3` (`"abc"`).

4. **`right = 3`, `ch = 'a'`**:
   - Duplicate `'a'` found! Previous index was `0`.
   - Move `left = max(0, 0 + 1) = 1`.
   - `map.put('a', 3)`.
   - Window is now `"bca"`, `length = 3`.

5. Continuing through string yields `maxLength = 3`.

---

### ⚠️ Edge Cases & Pitfalls

- **Empty String**: `s = ""` should return `0`.
- **String with All Same Characters**: `s = "bbbbb"` should return `1`.
- **Stale Index in Map**: Always use `left = Math.max(left, map.get(ch) + 1)`! If a character's stored index is outside the current window (`< left`), updating `left` without `Math.max` would illegally move `left` backward.

---

### 💻 Production Java Solution

```java
import java.util.HashMap;
import java.util.Map;

public class LongestSubstringWithoutRepeating {
    public int lengthOfLongestSubstring(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }

        Map<Character, Integer> charIndexMap = new HashMap<>();
        int maxLength = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char currentChar = s.charAt(right);

            if (charIndexMap.containsKey(currentChar)) {
                // Move left pointer past the last seen index of currentChar
                left = Math.max(left, charIndexMap.get(currentChar) + 1);
            }

            charIndexMap.put(currentChar, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }
}
```

---

### ⏱️ Time & Space Complexity

- **Time Complexity**: $O(N)$
  The `right` pointer moves from `0` to `N - 1`. Each character is processed once.
- **Space Complexity**: $O(\min(N, M))$
  Where $M$ is the size of the character set (ASCII = 128 or Unicode).
