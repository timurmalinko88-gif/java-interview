---
id: algo-036
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Trie
time_complexity: O(L) per operation
space_complexity: O(Alphabet * L * N)
leetcode_id: 208
frequency: 95%
time: 12 min
tags: [Trie, Design, LeetCode 208]
---

# LeetCode 208: Implement Trie (Prefix Tree)

Implement the `Trie` class with `insert`, `search`, and `startsWith` methods.

### Constraints:
- `1 <= word.length, prefix.length <= 2000`

---ANSWER---

### 💡 Intuition & Pattern Recognition

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
- **Space Complexity:** O(26 * L * N)
