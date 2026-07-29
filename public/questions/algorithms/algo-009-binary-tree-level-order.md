---
id: algo-009
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Tree BFS
time_complexity: O(N)
space_complexity: O(N)
leetcode_id: 102
frequency: 96%
time: 12 min
tags: [Tree, Breadth-First Search, Queue, LeetCode 102]
---

# LeetCode 102: Binary Tree Level Order Traversal

Given the `root` of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).

### Constraints:
- The number of nodes in the tree is in the range `[0, 2000]`.
- `-1000 <= Node.val <= 1000`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Level-order traversal requires processing nodes level by level (horizontal scanning).

The fundamental data structure for level-by-level processing is a **Queue (BFS - Breadth First Search)**:
- Push `root` into the queue.
- Process the queue level by level by taking snapshot `int levelSize = queue.size()` at the start of each outer iteration.
- Loop `levelSize` times to pop nodes belonging to the current level, record their values into a list, and offer their `left` and `right` children into the queue for the next level.


### ⚙️ Step-by-Step Visual Walkthrough

Consider tree: `[3, 9, 20, null, null, 15, 7]`

```
    3
   / \
  9  20
    /  \
   15   7
```

1. **Level 0**: Queue `[3]`.
   - `levelSize = 1`.
   - Pop `3`, add to level list `[3]`.
   - Offer children `9` and `20`. Queue becomes `[9, 20]`.
   - Result: `[[3]]`.

2. **Level 1**: Queue `[9, 20]`.
   - `levelSize = 2`.
   - Pop `9`, add to level list. `9` has no children.
   - Pop `20`, add to level list. Offer `15` and `7`. Queue becomes `[15, 7]`.
   - Result: `[[3], [9, 20]]`.

3. **Level 2**: Queue `[15, 7]`.
   - `levelSize = 2`.
   - Pop `15`, pop `7`. No children. Queue becomes `[]`.
   - Result: `[[3], [9, 20], [15, 7]]`.


### ⚠️ Edge Cases & Pitfalls

- **Empty Tree**: If `root == null`, return an empty list `[]`.
- **Mixing Up Queue Size**: Taking `int levelSize = queue.size()` BEFORE the inner loop is mandatory! If you call `queue.size()` dynamically inside the inner loop condition, pushing children will inflate the loop count and mix up levels.


### 💻 Production Java Solution

```java
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class LevelOrderTraversal {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) {
            return result;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size(); // Freeze count of nodes in current level
            List<Integer> currentLevel = new ArrayList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();
                currentLevel.add(currentNode.val);

                if (currentNode.left != null) {
                    queue.offer(currentNode.left);
                }
                if (currentNode.right != null) {
                    queue.offer(currentNode.right);
                }
            }

            result.add(currentLevel);
        }

        return result;
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(N)
  Every node in the binary tree is visited exactly once.
- **Space Complexity**: O(N)
  Queue holds at most the maximum width of the tree (for a complete binary tree, bottom level contains $N/2$ nodes).
