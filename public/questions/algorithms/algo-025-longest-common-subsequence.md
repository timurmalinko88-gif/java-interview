---
id: algo-025
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Dynamic Programming
time_complexity: O(M * N)
space_complexity: O(M * N)
leetcode_id: 1143
frequency: 91%
time: 12 min
tags: [Strings, 2D Dynamic Programming, LeetCode 1143]
---

# LeetCode 1143: Longest Common Subsequence

Given two strings `text1` and `text2`, return the length of their longest common subsequence.

### Constraints:
- `1 <= text1.length, text2.length <= 1000`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Let `dp[i][j]` be LCS length of `text1[0...i-1]` and `text2[0...j-1]`.
- If match: `dp[i][j] = 1 + dp[i-1][j-1]`
- Else: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

### ⚙️ Step-by-Step Visual Walkthrough

For `text1 = "abcde"`, `text2 = "ace"`:
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
- **Space Complexity:** O(M * N)
