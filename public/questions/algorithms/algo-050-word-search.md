---
id: algo-050
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Backtracking
time_complexity: O(N * M * 3^L)
space_complexity: O(L)
leetcode_id: 79
frequency: 95%
time: 12 min
tags: [Matrix, Backtracking, DFS, LeetCode 79]
---

# LeetCode 79: Word Search

Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.

### Constraints:
- `m == board.length`, `n == board[i].length`, `1 <= m, n <= 6`

---ANSWER---

### 💡 Intuition & Pattern Recognition

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
- **Space Complexity:** O(L) — recursion stack depth.
