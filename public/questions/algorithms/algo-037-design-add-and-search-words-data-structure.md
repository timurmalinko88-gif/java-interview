---
id: algo-037
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Trie
time_complexity: O(L) insert / O(26^L) search with dots
space_complexity: O(Trie size)
leetcode_id: 211
frequency: 90%
time: 12 min
tags: [Trie, DFS, Design, LeetCode 211]
---

# LeetCode 211: Design Add and Search Words Data Structure

Design a data structure that supports adding new words and finding if a string matches any previously added string. Dots `'.'` match any letter.

### Constraints:
- `1 <= word.length <= 25`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Trie + Recursive DFS:
When encountering a regular letter `c`, follow `curr.children[c - 'a']`.
When encountering wildcard `'.'`: branch and search all 26 non-null child nodes recursively!

### 💻 Production Java Implementation

```java
public class WordDictionary {

    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    private final TrieNode root;

    public WordDictionary() {
        root = new TrieNode();
    }

    public void addWord(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }

    public boolean search(String word) {
        return searchInNode(word, 0, root);
    }

    private boolean searchInNode(String word, int index, TrieNode node) {
        if (node == null) return false;
        if (index == word.length()) return node.isEnd;

        char c = word.charAt(index);
        if (c == '.') {
            for (TrieNode child : node.children) {
                if (child != null && searchInNode(word, index + 1, child)) {
                    return true;
                }
            }
            return false;
        } else {
            return searchInNode(word, index + 1, node.children[c - 'a']);
        }
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(L) without wildcards, worst-case O(26^L) with all dots.
- **Space Complexity:** O(Trie size)
