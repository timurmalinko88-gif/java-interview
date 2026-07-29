---
id: algo-032
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: Tree DFS
time_complexity: O(N)
space_complexity: O(H)
leetcode_id: 124
frequency: 94%
time: 15 min
tags: [Tree, DFS, Recursion, LeetCode 124]
---

# LeetCode 124: Binary Tree Maximum Path Sum

A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. A node can only appear in the sequence at most once. Return *the maximum path sum of any non-empty path*.

### Constraints:
- Number of nodes in range `[1, 3 * 10^4]`

---ANSWER---

### 💡 Intuition & Pattern Recognition

For any node `u` in a DFS traversal:
1. Max branch sum extending upwards = `node.val + max(0, max(leftGain, rightGain))`
2. Max path sum passing THROUGH node `u` as root of sub-path = `node.val + max(0, leftGain) + max(0, rightGain)`

We update a global `maxSum` with option 2 at every node, while returning option 1 to parent recursive calls.

### ⚙️ Step-by-Step Visual Walkthrough

For tree: `[-10, 9, 20, null, null, 15, 7]`:
1. Node 15: returns 15.
2. Node 7: returns 7.
3. Node 20: path sum through 20 = 20 + 15 + 7 = 42. Global max = 42. Returns `20 + max(15, 7) = 35`.
4. Node 9: returns 9.
5. Root -10: path sum through root = -10 + 9 + 35 = 34. Global max stays 42.
Result: `42`.

### 💻 Production Java Implementation

```java
public class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        maxGain(root);
        return maxSum;
    }

    private int maxGain(TreeNode node) {
        if (node == null) return 0;

        int leftGain = Math.max(maxGain(node.left), 0);
        int rightGain = Math.max(maxGain(node.right), 0);

        int currentPathSum = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentPathSum);

        return node.val + Math.max(leftGain, rightGain);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — visits each node once.
- **Space Complexity:** O(H) — recursion stack height.
