---
id: algo-039
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Graph Topological Sort
time_complexity: O(V + E)
space_complexity: O(V + E)
leetcode_id: 207
frequency: 96%
time: 12 min
tags: [Graph, Topological Sort, BFS, LeetCode 207]
---

# LeetCode 207: Course Schedule

There are `numCourses` courses you have to take, labeled `0` to `numCourses - 1`. Prerequisites are given as `prerequisites[i] = [a, b]` meaning you must take course `b` first before `a`.

Return `true` if you can finish all courses.

### Constraints:
- `1 <= numCourses <= 2000`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Kahn's Algorithm (Topological Sort BFS):
1. Build adjacency list graph and `inDegree` array tracking incoming edge counts per node.
2. Enqueue all nodes with `inDegree == 0` (courses with no prerequisites).
3. Process queue: decrement `inDegree` of neighbors. If neighbor's `inDegree` becomes 0, enqueue it.
4. If processed count == `numCourses`, valid DAG! Else graph contains a cycle.

### 💻 Production Java Implementation

```java
public class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[numCourses];

        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());

        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.add(i);
        }

        int count = 0;
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            count++;

            for (int neighbor : graph.get(curr)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) queue.add(neighbor);
            }
        }

        return count == numCourses;
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(V + E) — visits every vertex and edge once.
- **Space Complexity:** O(V + E) — graph storage.
