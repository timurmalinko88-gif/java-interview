---
id: algo-041
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: BFS / DFS
time_complexity: O(V + E)
space_complexity: O(V)
leetcode_id: 133
frequency: 91%
time: 10 min
tags: [Graph, BFS, DFS, LeetCode 133]
---

# LeetCode 133: Clone Graph

Given a reference of a node in a connected undirected graph, return a **deep copy** (clone) of the graph.

### Constraints:
- Number of nodes in graph is in range `[0, 100]`.

---ANSWER---

### 💡 Intuition & Pattern Recognition

HashMap `visited` mapping `originalNode -> clonedNode`.
Use BFS or DFS to traverse graph. For each node, clone it, store in map, and recursively clone neighbor pointers.

### 💻 Production Java Implementation

```java
public class Solution {
    private final Map<Node, Node> visited = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;

        if (visited.containsKey(node)) {
            return visited.get(node);
        }

        Node clone = new Node(node.val, new ArrayList<>());
        visited.put(node, clone);

        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(cloneGraph(neighbor));
        }

        return clone;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(V + E)
- **Space Complexity:** O(V)
