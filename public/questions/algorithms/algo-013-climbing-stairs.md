---
id: algo-013
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Junior
pattern: Dynamic Programming
time_complexity: O(N)
space_complexity: O(1)
leetcode_id: 70
frequency: 98%
time: 8 min
tags: [Dynamic Programming, Math, LeetCode 70]
---

# LeetCode 70: Climbing Stairs

You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?

### Constraints:
- `1 <= n <= 45`

---ANSWER---

### 💡 Intuition & Pattern Recognition

To reach step `n`, you can only come from two possible prior steps:
1. From step `n - 1` by taking **1 step**.
2. From step `n - 2` by taking **2 steps**.

Therefore, total ways to reach step `n` is:
$$\text{dp}[n] = \text{dp}[n-1] + \text{dp}[n-2]$$

This is the exact recurrence relation of the **Fibonacci Sequence**:
- Base cases: $\text{dp}[1] = 1$, $\text{dp}[2] = 2$.
- To achieve O(1) space, we only need to keep track of the last two calculated values (`prev1` and `prev2`) rather than maintaining a full array.


### ⚙️ Step-by-Step Visual Walkthrough

Consider `n = 5`.

- Step 1: 1 way (`[1]`)
- Step 2: 2 ways (`[1+1, 2]`)
- Step 3: $1 + 2 = 3$ ways (`[1+1+1, 1+2, 2+1]`)
- Step 4: $2 + 3 = 5$ ways
- Step 5: $3 + 5 = 8$ ways


### ⚠️ Edge Cases & Pitfalls

- **Small n**: `n = 1` or `n = 2` must return `1` or `2` directly without entering the loop.
- **Naive Recursion**: Naive recursive Fibonacci `climbStairs(n-1) + climbStairs(n-2)` takes exponential O(2^N) time and will throw `Time Limit Exceeded`. Dynamic Programming optimizes this to linear O(N) time.


### 💻 Production Java Solution

```java
public class ClimbingStairs {
    public int climbStairs(int n) {
        if (n <= 2) {
            return n;
        }

        int prev2 = 1; // Ways to reach step 1
        int prev1 = 2; // Ways to reach step 2
        int current = 0;

        for (int i = 3; i <= n; i++) {
            current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }

        return prev1;
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(N)
  Single loop running from `3` to `n`.
- **Space Complexity**: O(1)
  Only three integer variables are stored.
