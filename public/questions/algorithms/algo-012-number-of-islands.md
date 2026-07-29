---
id: algo-012
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Graph Traversal
time_complexity: O(M * N)
space_complexity: O(M * N)
leetcode_id: 200
frequency: 99%
time: 15 min
tags: [Depth-First Search, Breadth-First Search, Matrix, LeetCode 200]
---

# LeetCode 200: Number of Islands

Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the **number of islands**.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

### Constraints:
- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 300`
- `grid[i][j]` is `'0'` or `'1'`.

---ANSWER---

### 💡 Intuition & Pattern Recognition

This is the flagship problem for **2D Grid Traversal (DFS / BFS)**.

Think of the grid as an undirected graph where each cell `(r, c)` containing `'1'` is a vertex connected to its 4 cardinal neighbors (up, down, left, right).

**Algorithm:**
1. Iterate over every cell `(r, c)` in the grid.
2. If `grid[r][c] == '1'`, we have discovered a new island!
   - Increment `islandCount++`.
   - Trigger a **DFS** or **BFS** traversal starting from `(r, c)` to visit and sink all connected land cells by changing `'1'` → `'0'` (or marking them visited).
3. Continue scanning remaining cells.


### ⚙️ Step-by-Step Visual Walkthrough

Consider grid:
```
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
```

1. **`r = 0, c = 0` (`'1'`)**:
   - `islandCount = 1`.
   - Start DFS from `(0,0)`: sinks `(0,0)`, `(0,1)`, `(1,0)`, `(1,1)` to `'0'`.
   - Grid becomes:
     ```
     0 0 0 0 0
     0 0 0 0 0
     0 0 1 0 0
     0 0 0 1 1
     ```

2. Scan continues until **`r = 2, c = 2` (`'1'`)**:
   - `islandCount = 2`.
   - DFS sinks `(2,2)`.

3. Scan continues until **`r = 3, c = 3` (`'1'`)**:
   - `islandCount = 3`.
   - DFS sinks `(3,3)` and `(3,4)`.

Final result: `3` islands.


### ⚠️ Edge Cases & Pitfalls

- **Out of Bounds Check**: Before accessing `grid[r][c]`, verify `0 <= r < m` and `0 <= n < n`.
- **Character Grid vs Integer Grid**: Note that grid contains `char` values `'1'` and `'0'`, not primitive `int` `1` and `0`. Comparing `grid[r][c] == 1` instead of `'1'` is a common bug.
- **In-place Sinking**: Sinking visited land to `'0'` saves memory by eliminating the need for a boolean `visited[][]` array.


### 💻 Production Java Solution

```java
public class NumberOfIslands {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) {
            return 0;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int islandCount = 0;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    islandCount++;
                    dfsSink(grid, r, c, rows, cols);
                }
            }
        }

        return islandCount;
    }

    private void dfsSink(char[][] grid, int r, int c, int rows, int cols) {
        // Base case: boundary check and water check
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') {
            return;
        }

        // Mark current land as visited by sinking it to water
        grid[r][c] = '0';

        // Recurse on all 4 cardinal directions
        dfsSink(grid, r - 1, c, rows, cols); // Up
        dfsSink(grid, r + 1, c, rows, cols); // Down
        dfsSink(grid, r, c - 1, rows, cols); // Left
        dfsSink(grid, r, c + 1, rows, cols); // Right
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(M \times N)
  Every cell in the $M \times N$ grid is inspected once by the outer loop and visited at most once by DFS.
- **Space Complexity**: O(M \times N)
  In the worst-case scenario (entire grid filled with land `'1'`), the call stack depth reaches $M \times N$.
