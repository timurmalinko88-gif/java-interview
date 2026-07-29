---
id: algo-034
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Tree DFS
time_complexity: O(H + K)
space_complexity: O(H)
leetcode_id: 230
frequency: 91%
time: 10 min
tags: [Tree, BST, Inorder Traversal, LeetCode 230]
---

# LeetCode 230: Kth Smallest Element in a BST

Given the `root` of a binary search tree and an integer `k`, return *the `k`-th smallest value (1-indexed) of all the values of the nodes in the tree*.

### Constraints:
- `1 <= k <= number of nodes <= 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

In-order traversal (Left -> Node -> Right) of a Binary Search Tree visits node values in **strictly sorted ascending order**.
Perform iterative or recursive In-order traversal and decrement `k` at each visited node. When `k == 0`, return current node value!

### 💻 Production Java Implementation

```java
public class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;

        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }

            curr = stack.pop();
            k--;
            if (k == 0) return curr.val;

            curr = curr.right;
        }

        return -1;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(H + K) — stops as soon as k-th node is reached.
- **Space Complexity:** O(H) — stack depth equal to tree height.
