---
id: algo-038
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: Trie
time_complexity: O(M * N * 3^L)
space_complexity: O(Words Total Chars)
leetcode_id: 212
frequency: 93%
time: 15 min
tags: [Trie, Backtracking, Matrix, LeetCode 212]
---

# LeetCode 212: Word Search II

Given an `m x n` `board` of characters and a list of strings `words`, return *all words on the board*.

### Constraints:
- `m == board.length`, `n == board[i].length`
- `1 <= m, n <= 12`

---ANSWER---

### 💡 Intuition & Pattern Recognition

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
- **Space Complexity:** O(Words Total Characters)
