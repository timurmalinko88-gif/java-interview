---
id: algo-014
topic: Algorithm Breakdown
format: Algo Breakdown
difficulty: Middle
pattern: Dynamic Programming
time_complexity: O(amount * N)
space_complexity: O(amount)
leetcode_id: 322
frequency: 96%
time: 15 min
tags: [Dynamic Programming, Breadth-First Search, LeetCode 322]
---

# LeetCode 322: Coin Change

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.

You may assume that you have an infinite number of each kind of coin.

### Constraints:
- `1 <= coins.length <= 12`
- `1 <= coins[i] <= 2^31 - 1`
- `0 <= amount <= 10^4`

---ANSWER---

### 💡 Intuition & Pattern Recognition

Greedy approach (choosing the largest coin first) fails for non-canonical coin systems!
*Counterexample:* `coins = [1, 3, 4, 5]`, `amount = 7`.
- Greedy picks `5 + 1 + 1` (3 coins).
- Optimal DP solution is `4 + 3` (2 coins).

This is a classic **Unbounded Knapsack / Bottom-Up 1D Dynamic Programming** problem:
- Define `dp[i]` as the minimum number of coins needed to make up amount `i`.
- Base case: `dp[0] = 0` (0 coins to make amount 0), initialize all other `dp[i] = amount + 1` (acting as infinity).
- State Transition:
  For each amount `i` from `1` to `amount` and each coin denomination `c`:
  If `i - c >= 0`:
  $$\text{dp}[i] = \min(\text{dp}[i], 1 + \text{dp}[i - c])$$


### ⚙️ Step-by-Step Visual Walkthrough

Consider `coins = [1, 2, 5]`, `amount = 11`.

1. Initialize `dp` array of size `12`:
   `dp = [0, inf, inf, inf, inf, inf, inf, inf, inf, inf, inf, inf]`

2. Processing `i = 1`:
   - coin 1: `dp[1] = min(inf, 1 + dp[0]) = 1`
   - `dp[1] = 1`

3. Processing `i = 2`:
   - coin 1: `dp[2] = min(inf, 1 + dp[1]) = 2`
   - coin 2: `dp[2] = min(2, 1 + dp[0]) = 1`
   - `dp[2] = 1`

4. By amount `i = 11`:
   - `dp[11] = 1 + dp[6] = 1 + (1 + dp[1]) = 3` (coins `5 + 5 + 1`).


### ⚠️ Edge Cases & Pitfalls

- **Amount is 0**: `amount == 0` should return `0` immediately.
- **Impossible Amount**: If `dp[amount] > amount`, return `-1`.
- **Integer Overflow**: Filling `dp` with `Integer.MAX_VALUE` can cause `1 + dp[i - coin]` to wrap around into negative numbers. Use `amount + 1` instead of `Integer.MAX_VALUE` as the sentinel "infinity" value.


### 💻 Production Java Solution

```java
import java.util.Arrays;

public class CoinChange {
    public int coinChange(int[] coins, int amount) {
        if (amount < 1) {
            return 0;
        }

        // dp[i] will store min coins to make amount i
        int[] dp = new int[amount + 1];
        // Use amount + 1 as sentinel infinity value to avoid int overflow
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
                }
            }
        }

        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```


### ⏱️ Time & Space Complexity

- **Time Complexity**: O(\text{amount} \times N)
  Outer loop runs `amount` times, inner loop iterates over $N$ coin denominations.
- **Space Complexity**: O(\text{amount})
  DP table of size `amount + 1`.
