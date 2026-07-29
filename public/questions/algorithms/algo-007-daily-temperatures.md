---
id: algo-007
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Monotonic Stack
time_complexity: O(N)
space_complexity: O(N)
leetcode_id: 739
frequency: 93%
time: 15 min
tags: [Stack, Monotonic Stack, Arrays, LeetCode 739]
---

# LeetCode 739: Daily Temperatures

Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.

### Constraints:
- `1 <= temperatures.length <= 10^5`
- `30 <= temperatures[i] <= 100`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Brute-force requires scanning forward for every element to find the next larger temperature (O(N^2) time).

Whenever a problem asks for the **"next greater element"** or **"next smaller element"** in an array, the optimal pattern is a **Monotonic Stack**:
- Maintain a stack storing **indices** of temperatures in strictly decreasing order.
- When inspecting `temperatures[i]`, if it is warmer than `temperatures[stack.peek()]`, we have found the next warmer day for `stack.peek()`!
- Pop index `prevDay = stack.pop()` and set `answer[prevDay] = i - prevDay`.
- Repeat popping until stack top is warmer than current day, then push current index `i`.


### ⚙️ Step-by-Step Visual Walkthrough

Consider `temperatures = [73, 74, 75, 71, 69, 72, 76]`.

1. `i = 0 (73)`: Stack empty → push index `0`. Stack: `[0]`
2. `i = 1 (74)`: `74 > 73` (top index 0). Pop `0` → `ans[0] = 1 - 0 = 1`. Push `1`. Stack: `[1]`
3. `i = 2 (75)`: `75 > 74` (top index 1). Pop `1` → `ans[1] = 2 - 1 = 1`. Push `2`. Stack: `[2]`
4. `i = 3 (71)`: `71 < 75`. Push `3`. Stack: `[2, 3]`
5. `i = 4 (69)`: `69 < 71`. Push `4`. Stack: `[2, 3, 4]`
6. `i = 5 (72)`:
   - `72 > 69` (top index 4) → pop `4`, `ans[4] = 5 - 4 = 1`.
   - `72 > 71` (top index 3) → pop `3`, `ans[3] = 5 - 3 = 2`.
   - `72 < 75` (top index 2) → stop popping. Push `5`. Stack: `[2, 5]`
7. `i = 6 (76)`: `76` pops `5` (`ans[5] = 1`), pops `2` (`ans[2] = 4`). Push `6`.

Final `answer = [1, 1, 4, 2, 1, 1, 0]`.


### ⚠️ Edge Cases & Pitfalls

- **Storing Indices vs Values**: Always store **array indices** on the stack, not raw temperature values, because we need to compute distance `i - prevIndex`.
- **No Warmer Day Exists**: Array default values in Java are `0`, which correctly handles days that never see a warmer temperature.
- **Monotonic Property**: The temperatures corresponding to indices in the stack are always kept in non-increasing order.


### 💻 Production Java Solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DailyTemperatures {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // Stores indices

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int prevIndex = stack.pop();
                answer[prevIndex] = i - prevIndex;
            }
            stack.push(i);
        }

        return answer;
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(N)
  Each element/index is pushed onto the stack exactly once and popped at most once.
- **Space Complexity**: O(N)
  In the worst case (temperatures in strictly decreasing order like `[80, 70, 60]`), stack holds $N$ indices.
