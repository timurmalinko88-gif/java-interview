---
id: algo-035
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Tree DFS
time_complexity: O(N)
space_complexity: O(H)
leetcode_id: 98
frequency: 96%
time: 10 min
tags: [Tree, BST, DFS, LeetCode 98]
---

# LeetCode 98: Validate Binary Search Tree

Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).

### Constraints:
- Number of nodes in range `[1, 10^4]`

---ANSWER---

### 💡 Intuition & Pattern Recognition

A valid BST requires that for every node `u`:
- ALL nodes in `u.left` subtree must be strictly `< u.val`.
- ALL nodes in `u.right` subtree must be strictly `> u.val`.

Pass valid range bounds `(min, max)` down during recursive DFS traversal.

### 💻 Production Java Implementation

```java
public class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private boolean validate(TreeNode node, Integer min, Integer max) {
        if (node == null) return true;

        if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
            return false;
        }

        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N)
- **Space Complexity:** O(H)
