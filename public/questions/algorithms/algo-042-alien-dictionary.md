---
id: algo-042
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: Graph Topological Sort
time_complexity: O(C)
space_complexity: O(1)
leetcode_id: 269
frequency: 88%
time: 15 min
tags: [Graph, Topological Sort, LeetCode 269]
---

# LeetCode 269: Alien Dictionary

There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you. You are given a list of strings `words` sorted lexicographically by the rules of this new language. Return a string of the unique letters in the alien language sorted in lexicographically increasing order. If invalid, return `""`.

### Constraints:
- `1 <= words.length <= 100`

---ANSWER---

### 💡 Intuition & Pattern Recognition

1. Build DAG character graph: Compare adjacent words `w1` and `w2`. First differing character `w1[i] != w2[i]` defines directed edge `w1[i] -> w2[i]`.
2. Invalid prefix check: If `w2` is prefix of `w1` (e.g. `"abc"` before `"ab"`), order is invalid!
3. Perform Topological Sort (Kahn's or DFS). If output length != total unique characters, graph contains cycle.

### 💻 Production Java Implementation

```java
public class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> graph = new HashMap<>();
        Map<Character, Integer> inDegree = new HashMap<>();

        for (String w : words) {
            for (char c : w.toCharArray()) {
                inDegree.putIfAbsent(c, 0);
                graph.putIfAbsent(c, new HashSet<>());
            }
        }

        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i], w2 = words[i + 1];
            if (w1.length() > w2.length() && w1.startsWith(w2)) return "";

            for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {
                char c1 = w1.charAt(j), c2 = w2.charAt(j);
                if (c1 != c2) {
                    if (!graph.get(c1).contains(c2)) {
                        graph.get(c1).add(c2);
                        inDegree.put(c2, inDegree.get(c2) + 1);
                    }
                    break;
                }
            }
        }

        Queue<Character> queue = new LinkedList<>();
        for (char c : inDegree.keySet()) {
            if (inDegree.get(c) == 0) queue.add(c);
        }

        StringBuilder sb = new StringBuilder();
        while (!queue.isEmpty()) {
            char c = queue.poll();
            sb.append(c);
            for (char neighbor : graph.get(c)) {
                inDegree.put(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) == 0) queue.add(neighbor);
            }
        }

        return sb.length() == inDegree.size() ? sb.toString() : "";
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(C) total characters.
- **Space Complexity:** O(1) — at most 26 lowercase English letters.
