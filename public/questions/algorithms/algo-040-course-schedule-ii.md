---
id: algo-040
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Graph Topological Sort
time_complexity: O(V + E)
space_complexity: O(V + E)
leetcode_id: 210
frequency: 93%
time: 12 min
tags: [Graph, Topological Sort, BFS, LeetCode 210]
---

# LeetCode 210: Course Schedule II

Return the ordering of courses you should take to finish all courses. If impossible, return an empty array.

### Constraints:
- `1 <= numCourses <= 2000`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Kahn's Algorithm returning topological order array:
Identical to Course Schedule I, but store each dequeued course into an `order` result array.

### 💻 Production Java Implementation

```java
public class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
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

        int[] order = new int[numCourses];
        int index = 0;

        while (!queue.isEmpty()) {
            int curr = queue.poll();
            order[index++] = curr;

            for (int neighbor : graph.get(curr)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) queue.add(neighbor);
            }
        }

        return index == numCourses ? order : new int[0];
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(V + E)
- **Space Complexity:** O(V + E)
