---
id: algo-043
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: BFS / DFS
time_complexity: O(M * N)
space_complexity: O(M * N)
leetcode_id: 417
frequency: 89%
time: 12 min
tags: [Graph, BFS, DFS, LeetCode 417]
---

# LeetCode 417: Pacific Atlantic Water Flow

Return a 2D list of grid coordinates where water can flow to both the Pacific (top/left) and Atlantic (bottom/right) oceans.

### Constraints:
- `m == heights.length`, `n == heights[i].length`
- `1 <= m, n <= 200`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Reverse Flow DFS/BFS:
Instead of simulating water flowing downhill from every cell, start from ocean borders and flow **uphill**:
- Run DFS from Pacific edges (top & left).
- Run DFS from Atlantic edges (bottom & right).
Intersection of both reachable boolean grids is the answer!

### 💻 Production Java Implementation

```java
public class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        List<List<Integer>> res = new ArrayList<>();
        if (heights == null || heights.length == 0) return res;

        int m = heights.length, n = heights[0].length;
        boolean[][] pacific = new boolean[m][n];
        boolean[][] atlantic = new boolean[m][n];

        for (int i = 0; i < m; i++) {
            dfs(heights, pacific, i, 0, heights[i][0]);
            dfs(heights, atlantic, i, n - 1, heights[i][n - 1]);
        }

        for (int j = 0; j < n; j++) {
            dfs(heights, pacific, 0, j, heights[0][j]);
            dfs(heights, atlantic, m - 1, j, heights[m - 1][j]);
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (pacific[i][j] && atlantic[i][j]) {
                    res.add(Arrays.asList(i, j));
                }
            }
        }

        return res;
    }

    private void dfs(int[][] heights, boolean[][] ocean, int r, int c, int prevHeight) {
        if (r < 0 || r >= heights.length || c < 0 || c >= heights[0].length) return;
        if (ocean[r][c] || heights[r][c] < prevHeight) return;

        ocean[r][c] = true;
        dfs(heights, ocean, r + 1, c, heights[r][c]);
        dfs(heights, ocean, r - 1, c, heights[r][c]);
        dfs(heights, ocean, r, c + 1, heights[r][c]);
        dfs(heights, ocean, r, c - 1, heights[r][c]);
    }
}
```

### ⏱ Complexity Analysis

- **Time Complexity:** O(M * N)
- **Space Complexity:** O(M * N)
