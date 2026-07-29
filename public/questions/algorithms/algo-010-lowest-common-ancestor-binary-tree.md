---
id: algo-010
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Tree DFS
time_complexity: O(N)
space_complexity: O(H)
leetcode_id: 236
frequency: 95%
time: 15 min
tags: [Tree, Depth-First Search, Recursion, LeetCode 236]
---

# LeetCode 236: Lowest Common Ancestor of a Binary Tree

Given a binary tree, find the **lowest common ancestor (LCA)** of two given nodes `p` and `q`.

The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow a node to be a descendant of itself).

### Constraints:
- The number of nodes in the tree is in the range `[2, 10^5]`.
- All `Node.val` are unique.
- `p` and `q` are distinct and guaranteed to exist in the tree.

---ANSWER---

### 💡 Intuition & Pattern Recognition

This is a classic **Recursive Tree DFS (Post-order Traversal)** problem.

**Base Case:**
If `root == null`, `root == p`, or `root == q`, return `root`.

**Recursive Step:**
- Recursively call `lowestCommonAncestor(root.left, p, q)`.
- Recursively call `lowestCommonAncestor(root.right, p, q)`.

**Combining Results:**
1. If both `left != null` and `right != null`, it means `p` is in one subtree and `q` is in the other subtree. Therefore, `root` **is the Lowest Common Ancestor**! Return `root`.
2. If only one side returns non-null (e.g. `left != null`), it means both `p` and `q` are located in that subtree. Return `left != null ? left : right`.


### ⚙️ Step-by-Step Visual Walkthrough

Consider tree:
```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```
Find LCA of `p = 5` and `q = 1`:
1. Call DFS on `root = 3`.
2. DFS left child `5`: `root == p` matches! Return `5`.
3. DFS right child `1`: `root == q` matches! Return `1`.
4. At `root = 3`: `left = 5` (non-null) and `right = 1` (non-null).
5. Both sides non-null → `3` is the LCA! Return `3`.


### ⚠️ Edge Cases & Pitfalls

- **One Node is Ancestor of the Other**: e.g., LCA of `5` and `4`. When DFS hits `5`, it immediately returns `5` without needing to traverse deeper down to `4`. When node `3` evaluates left branch `5` and right branch `null`, it returns `5`, which is the correct LCA.
- **Root is Null**: Handled cleanly by `if (root == null) return null;`.


### 💻 Production Java Solution

```java
public class LowestCommonAncestor {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Base Case: if root is null or matches either target node
        if (root == null || root == p || root == q) {
            return root;
        }

        // Divide: search in left and right subtrees
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // Conquer: evaluate results
        if (left != null && right != null) {
            return root; // p and q are on opposite subtrees
        }

        // If only one branch found nodes, propagate that branch up
        return left != null ? left : right;
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(N)
  In worst case, every node in the binary tree is visited once.
- **Space Complexity**: O(H)
  Call stack memory depends on tree height $H$ (O(\log N) for balanced tree, O(N) for skewed tree).
