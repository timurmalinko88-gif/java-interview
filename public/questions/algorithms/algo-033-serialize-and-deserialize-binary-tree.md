---
id: algo-033
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Senior
pattern: BFS / DFS
time_complexity: O(N)
space_complexity: O(N)
leetcode_id: 297
frequency: 95%
time: 15 min
tags: [Tree, DFS, Design, LeetCode 297]
---

# LeetCode 297: Serialize and Deserialize Binary Tree

Design an algorithm to serialize and deserialize a binary tree. Serialization is the process of converting a data structure into a sequence of bits or string.

### Constraints:
- Number of nodes in range `[0, 10^4]`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Pre-order DFS traversal with `"X"` marker for null nodes:
- `serialize`: Traverses root, left, right. Converts to comma-separated string `"1,2,X,X,3,4,X,X,5,X,X"`.
- `deserialize`: Converts string to Queue/List and reconstructs tree recursively reading left to right.

### 💻 Production Java Implementation

```java
public class Codec {

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("X," );
        } else {
            sb.append(node.val).append("," );
            buildString(node.left, sb);
            buildString(node.right, sb);
        }
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split("," )));
        return buildTree(nodes);
    }

    private TreeNode buildTree(Queue<String> nodes) {
        String val = nodes.poll();
        if (val.equals("X" )) return null;

        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(N) — linear pass during both encoding and decoding.
- **Space Complexity:** O(N) — queue storage.
