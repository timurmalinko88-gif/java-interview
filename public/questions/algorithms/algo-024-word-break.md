---
id: algo-024
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Dynamic Programming
time_complexity: O(N^2)
space_complexity: O(N)
leetcode_id: 139
frequency: 92%
time: 12 min
tags: [Strings, Dynamic Programming, LeetCode 139]
---

# LeetCode 139: Word Break

Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.

### Constraints:
- `1 <= s.length <= 300`

---ANSWER---

### 💡 Intuition & Pattern Recognition

`dp[i]` is true if substring `s[0...i-1]` can be segmented into words.
`dp[i] = true` if `dp[j] == true` AND `s[j...i]` exists in `wordDict`.

### ⚙️ Step-by-Step Visual Walkthrough

For `s = "leetcode"`, `wordDict = ["leet", "code"]`:
`dp[0] = true` → `dp[4] = true` (`"leet"`) → `dp[8] = true` (`"code"`).
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
- **Space Complexity:** O(N + M)
